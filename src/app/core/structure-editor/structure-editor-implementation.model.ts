import { Ketcher } from 'ketcher-wrapper';
import { JSDraw } from 'jsdraw-wrapper';
import { Editor } from './structure.editor.model';
import { Observable } from 'rxjs';

export class EditorImplementation implements Editor {
    private ketcher?: Ketcher;
    private jsdraw?: JSDraw;

    constructor(ketcher?: Ketcher, jsdraw?: JSDraw) {
        this.ketcher = ketcher;
        this.jsdraw = jsdraw;
    }

    getMolfile(): string {
        if (this.ketcher != null) {
            return this.ketcher.getMolfile();
        } else if (this.jsdraw != null) {
            const chargeLine = this.getMCharge();
            let mfile = this.jsdraw.getMolfile();
            mfile = mfile.replace(/0.0000[ ]D[ ][ ][ ]/g, '0.0000 H   ');

            if (mfile.indexOf('M  CHG') < 0) {
                if (chargeLine !== null) {
                    const lines = mfile.split('\n');
                    for (let i = lines.length - 1; i >= 3; i--) {
                        if (lines[i] === 'M  END') {
                            const old = lines[i];
                            lines[i] = chargeLine;
                            lines[i + 1] = old;
                            mfile = lines.join('\n');
                            break;
                        }
                    }
                }
            }

            return this.clean(mfile);
        } else {
            return null;
        }
    }

    private clean(molfile: string): string {
        molfile = molfile.replace(/M[ ]*SMT.*mul.*/g, '@')
            .replace(/\n/g, '|_|')
            .replace(/[@][|][_][|]/g, '')
            .replace(/[|][_][|]/g, '\n');
        return molfile;
    }

    setMolecule(molfile: string): void {
        if (this.ketcher != null) {
            this.ketcher.setMolecule(molfile);
        } else if (this.jsdraw != null) {
            this.jsdraw.options.data = molfile;
            this.jsdraw.setMolfile(molfile);
        }
    }

    structureUpdated(): Observable<string> {
        return new Observable<string>(observer => {
            if (this.jsdraw != null) {
                this.jsdraw.options.ondatachange = () => {
                    const molFile = this.getMolfile();
                    observer.next(molFile);
                };
            } else {
                observer.next('');
            }
        });
    }

    getMCharge(): string {
        if (this.jsdraw != null) {
            const xml = this.jsdraw.getXml();

            let aai = 1;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');

            const charges = Array.from(xmlDoc.getElementsByTagName('a'))
                .filter(element => element.hasAttribute('i'))
                .map(a => {
                    const ai = a.getAttribute('i');
                    let ac = Number(a.getAttribute('c'));
                    if (typeof ac === 'undefined') {
                        ac = 0;
                    }
                    const o: any = {
                        i: (aai++),
                        c: (ac - 0)
                    };
                    o.toString = () => {
                        return this.leftPad(o.i + '', 4) + this.leftPad(o.c + '', 4);
                    };
                    return o;
                })
                .filter(a => {
                    return a.c !== 0;
                });

            if (charges.length > 0) {
                return charges.reduce((arr, item, idx) => {
                        return idx % 8 === 0
                        ? [...arr, [item]]
                        : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
                    }, [])
                    .map(c => {
                        return 'M  CHG' + this.leftPad(c.length + '', 3) +
                        c.map(ic => ic.toString()).join('');
                    });
            }
        }
        return null;
    }

    private rep(v: string, n: number) {
        let t = '';
        for (let i = 0; i < n; i++) {
            t = t + v;
        }
        return t;
    }

    private leftPad (v: string, p: number) {
        return this.rep(' ', p - v.length) + v;
    }
}
