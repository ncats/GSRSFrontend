import { Editor, JSDraw, Ketcher } from './structure.editor.model';
import { Observable, from, take } from 'rxjs';
import { consolidateIsoLines, restoreMissingIsoEntries, getIsoEntries, getCounts, convertLegacyIsotopeSymbols } from './molfile-isotope.util';

export class EditorImplementation implements Editor {
    private ketcher?: Ketcher;
    private jsdraw?: JSDraw;
    tempMol?: string;
    firstload?: boolean;

    // Last complete V2000 molfile, used to restore isotope records dropped by Ketcher.
    private lastTrustedMolfile = '';

    // Ignore change events caused by programmatic Ketcher loads.
    private pendingProgrammaticLoads = 0;
    private pendingProgrammaticLoadTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(ketcher?: Ketcher, jsdraw?: JSDraw, toggledFrom?: string) {
        if (toggledFrom) {
            this.ketcher = ketcher;
            this.forceKetcherUpdate(toggledFrom);
        } else {
            this.jsdraw  = jsdraw;
            this.ketcher = ketcher;
        }
    }

    forceKetcherUpdate(mfile: string): void {
        this.jsdraw = undefined;
        setTimeout(() => {
            const chargeLine = this.getMCharge();
            mfile = convertLegacyIsotopeSymbols(mfile);

            if (mfile.indexOf('M  CHG') < 0 && chargeLine != null) {
                const lines = mfile.split('\n');
                for (let i = lines.length - 1; i >= 3; i--) {
                    if (lines[i] === 'M  END') {
                        lines.splice(i, 0, chargeLine);
                        mfile = lines.join('\n');
                        break;
                    }
                }
            }
            this.tempMol = this.clean(mfile);
            this.setKetcherMolecule(this.tempMol);
        }, 1);
    }

    getMolfile(): Observable<any> {
        return new Observable<any>(observer => {
            if (this.ketcher != null) {
                (this.ketcher.getMolfile('v2000') as Promise<string>).then(result => {
                    observer.next(this.getSafeKetcherMolfile(result || ''));
                });
            } else if (this.jsdraw != null) {
                const chargeLine = this.getMCharge();
                let mfile = this.jsdraw.getMolfile();
                mfile = convertLegacyIsotopeSymbols(mfile);

                if (mfile.indexOf('M  CHG') < 0 && chargeLine != null) {
                    const lines = mfile.split('\n');
                    for (let i = lines.length - 1; i >= 3; i--) {
                        if (lines[i] === 'M  END') {
                            lines.splice(i, 0, chargeLine);
                            mfile = lines.join('\n');
                            break;
                        }
                    }
                }
                observer.next(this.clean(mfile));
            } else {
                console.log('returning null');
                observer.next(null);
            }
        });
    }

    getSmiles(): Observable<string> {
        if (this.ketcher != null) {
            return from(this.ketcher.getSmiles());
        }
        return new Observable<string>(observer => {
            if (this.jsdraw != null) {
                observer.next(this.jsdraw.getSmiles());
            }
        });
    }

    private clean(molfile: string): string {
        molfile = molfile.replace(/M[ ]*SMT.*mul.*/g, '@')
            .replace(/\n/g, '|_|')
            .replace(/[@][|][_][|]/g, '')
            .replace(/[|][_][|]/g, '\n');

        // Remove duplicate polymer SMT groups written by JSDraw.
        if (molfile.indexOf('M  STY') >= 0) {
            const lines = molfile.split('\n');
            let dupCount = 0;
            const tset: Record<string, number> = {};
            Array.from(lines)
                 .filter(l => l.indexOf('M  SMT') >= 0)
                 .map(l => l.substring(0, 10))
                 .forEach(l => {
                     if (tset[l]) {
 dupCount++; 
}
                     tset[l] = 1;
                 });
            if (dupCount > 0) {
                molfile = molfile.replace(/@/g, '!#!')
                             .replace(/STY/g, '@')
                             .replace(/(M[ ][ ]@[ ][ ]1)([ ]*[0-9]*)([^@]*)SMT([ ]*[0-9]*)/g, '$1$2$3SMT$2')
                             .replace(/@/g, 'STY')
                             .replace(/!#!/g, '@');
            }
        }
        return molfile;
    }

    setMolecule(molfile: string): void {
        if (this.ketcher != null) {
            this.setKetcherMolecule(molfile);
        } else if (this.jsdraw != null) {
            // Keep the previous molecule on the undo stack.
            this.jsdraw.pushundo();
            this.jsdraw.options.data = molfile;
            this.jsdraw.setMolfile(molfile);
        }
    }

    // Consolidate isotope records and use V3000 for Ketcher display when supported.
    private setKetcherMolecule(molfile: string): void {
        const consolidated   = consolidateIsoLines(molfile || '');
        const displayMolfile = this.toV3000DisplayMolfile(consolidated) ?? consolidated;
        this.lastTrustedMolfile = consolidated;
        this.incrementPendingLoads();
        (this.ketcher as Ketcher).setMolecule(displayMolfile);
    }

    // Restore missing isotope records only when the atom and bond layout is unchanged.
    private getSafeKetcherMolfile(rawMolfile: string): string {
        const consolidated = consolidateIsoLines(rawMolfile || '');
        const repaired     = restoreMissingIsoEntries(this.lastTrustedMolfile, consolidated);
        this.lastTrustedMolfile = repaired;
        return repaired;
    }

    private incrementPendingLoads(): void {
        this.pendingProgrammaticLoads++;
        if (this.pendingProgrammaticLoadTimer !== null) {
            clearTimeout(this.pendingProgrammaticLoadTimer);
        }
        this.pendingProgrammaticLoadTimer = setTimeout(() => {
            this.pendingProgrammaticLoads = 0;
            this.pendingProgrammaticLoadTimer = null;
        }, 2000);
    }

    structureUpdated(): Observable<string> {
        return new Observable<string>(observer => {
            if (this.jsdraw != null) {
                this.jsdraw.options.ondatachange = () => {
                    this.getMolfile().pipe(take(1)).subscribe(result => {
                        observer.next(result);
                    });
                };
            } else if (this.ketcher != null) {
                const ketcher = this.ketcher;
                const handler = (operations: Array<{ operation: string }>) => {
                    const isLoadCanvas = operations.some(
                        op => op.operation === 'Load canvas',
                    );
                    const hasExplicitIsotopeEdit = operations.some(
                        (op: { operation: string; attribute?: string }) =>
                            op.operation === 'Set atom attribute' && op.attribute === 'isotope',
                    );

                    if (isLoadCanvas && this.pendingProgrammaticLoads > 0) {
                        this.pendingProgrammaticLoads--;
                        return;
                    }

                    // Untracked loads are user imports and must update the form.
                    (ketcher.getMolfile('v2000') as Promise<string>).then(result => {
                        const rawMolfile = consolidateIsoLines(result || '');
                        if (hasExplicitIsotopeEdit) {
                            this.lastTrustedMolfile = rawMolfile;
                            observer.next(rawMolfile);
                        } else {
                            observer.next(this.getSafeKetcherMolfile(rawMolfile));
                        }
                    });
                };

                ketcher.editor.subscribe('change', handler);

                return () => {
                    // Ketcher does not expose the subscription token here, so remove
                    // the matching internal handler when possible.
                    try {
                        const handlers: Array<{ handler: Function; f?: Function }> =
                            (ketcher.editor as any)?.event?.change?.handlers;
                        if (Array.isArray(handlers)) {
                            const idx = handlers.findIndex(
                                h => h.handler === handler || h.f === handler,
                            );
                            if (idx !== -1) {
 handlers.splice(idx, 1); 
}
                        }
                    } catch (_) { /* best-effort cleanup */ }

                    if (this.pendingProgrammaticLoadTimer !== null) {
                        clearTimeout(this.pendingProgrammaticLoadTimer);
                        this.pendingProgrammaticLoadTimer = null;
                        this.pendingProgrammaticLoads = 0;
                    }
                };
            }
        });
    }

    // V3000 is used only for Ketcher display. V2000 remains the saved format.
    // Unsupported CTfile records fall back to consolidated V2000.
    private toV3000DisplayMolfile(molfile: string): string | null {
        const isoEntries = getIsoEntries(molfile);
        if (isoEntries.length === 0) {
 return null; 
}

        const counts = getCounts(molfile);
        if (!counts) {
 return null; 
}

        // Other M records may contain features this conversion does not support.
        const lines = molfile.split('\n');
        for (const line of lines) {
            if (line.startsWith('M  ') &&
                !line.startsWith('M  ISO') &&
                !line.startsWith('M  CHG') &&
                line.trim() !== 'M  END') {
                return null;
            }
        }

        const atomLines = lines.slice(counts.lineIndex + 1, counts.lineIndex + 1 + counts.atomCount);
        const bondLines = lines.slice(
            counts.lineIndex + 1 + counts.atomCount,
            counts.lineIndex + 1 + counts.atomCount + counts.bondCount,
        );

        const atomParts = atomLines.map(l => l.trim().split(/\s+/));
        const bondParts = bondLines.map(l => l.trim().split(/\s+/));
        if (atomParts.some(p => !p[3]) || bondParts.some(p => p.length < 3)) {
            return null;
        }

        // JSDraw may omit one of the three standard header lines.
        const header = lines.slice(0, counts.lineIndex);
        while (header.length < 3) {
 header.push(''); 
}

        const isoByAtom    = new Map(isoEntries.map(e => [e.atomIndex, e.isotope]));
        const chargeByAtom = this.getChargeByAtomIndex(molfile);
        const stereoCfg: Record<number, number> = { 1: 1, 4: 2, 6: 3 };

        const v3000Atoms = atomParts.map((p, i) => {
            const atomIdx = i + 1;
            const props: string[] = [];
            const iso    = isoByAtom.get(atomIdx);
            const charge = chargeByAtom.get(atomIdx);
            if (iso    != null) {
 props.push(`MASS=${iso}`); 
}
            if (charge != null) {
 props.push(`CHG=${charge}`); 
}
            return `M  V30 ${atomIdx} ${p[3]} ${p[0]} ${p[1]} ${p[2]} 0`
                + (props.length ? ' ' + props.join(' ') : '');
        });

        const v3000Bonds = bondParts.map((p, i) => {
            const bondType = parseInt(p[2], 10);
            const cfg      = bondType === 1 ? stereoCfg[parseInt(p[3] || '0', 10)] : undefined;
            return `M  V30 ${i + 1} ${p[2]} ${p[0]} ${p[1]}`
                + (cfg != null ? ` CFG=${cfg}` : '');
        });

        return [
            ...header,
            `  0  0  0  0  0  0            999 V3000`,
            'M  V30 BEGIN CTAB',
            `M  V30 COUNTS ${counts.atomCount} ${counts.bondCount} 0 0 0`,
            'M  V30 BEGIN ATOM',
            ...v3000Atoms,
            'M  V30 END ATOM',
            'M  V30 BEGIN BOND',
            ...v3000Bonds,
            'M  V30 END BOND',
            'M  V30 END CTAB',
            'M  END',
        ].join('\n');
    }

    private getChargeByAtomIndex(molfile: string): Map<number, number> {
        const result = new Map<number, number>();
        if (!molfile) {
 return result; 
}
        for (const line of molfile.split('\n')) {
            if (!line.startsWith('M  CHG')) {
 continue; 
}
            const parts = line.trim().split(/\s+/);
            const count = parseInt(parts[2], 10);
            if (isNaN(count)) {
 continue; 
}
            for (let i = 0; i < count; i++) {
                const atomIndex = parseInt(parts[3 + i * 2], 10);
                const charge    = parseInt(parts[4 + i * 2], 10);
                if (!isNaN(atomIndex) && !isNaN(charge)) {
                    result.set(atomIndex, charge);
                }
            }
        }
        return result;
    }

    getMCharge(): string | null {
        if (this.jsdraw == null) {
 return null; 
}

        const xml    = this.jsdraw.getXml();
        let   aai    = 1;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');

        interface ChargeEntry { i: number; c: number; toString(): string; }
        const charges: ChargeEntry[] = Array.from(xmlDoc.getElementsByTagName('a'))
            .filter(el => el.hasAttribute('i'))
            .map(a => {
                const ac = Number(a.getAttribute('c')) || 0;
                const entry: ChargeEntry = {
                    i: aai++,
                    c: ac,
                    toString() {
                        return String(this.i).padStart(4) + String(this.c).padStart(4);
                    },
                };
                return entry;
            })
            .filter(a => a.c !== 0);

        if (charges.length === 0) {
 return null; 
}

        const chunkLines: string[] = [];
        for (let i = 0; i < charges.length; i += 8) {
            const chunk = charges.slice(i, i + 8);
            chunkLines.push(
                'M  CHG' + String(chunk.length).padStart(3)
                + chunk.map(ic => ic.toString()).join(''),
            );
        }
        return chunkLines.join('\n');
    }
}
