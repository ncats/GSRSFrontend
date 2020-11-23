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

    getSmiles(): string {
        if (this.ketcher != null) {
            return this.ketcher.getSmiles();
        } else if (this.jsdraw != null) {
            return this.jsdraw.getSmiles();
        }
    }

    private clean(molfile: string): string {
        molfile = molfile.replace(/M[ ]*SMT.*mul.*/g, '@')
            .replace(/\n/g, '|_|')
            .replace(/[@][|][_][|]/g, '')
            .replace(/[|][_][|]/g, '\n');
      
        // This corrects a rather silly bug
        // where JSDraw repeats SMT groups for polymers,
        // causing a lot of unforunate side effects

        if (molfile.indexOf('M  STY') >= 0) {
            const lines = molfile.split('\n');
            let dupCount = 0;
            let tset = {};
            Array.from(lines)
                 .filter(l=>l.indexOf('M  SMT')>=0)
                 .map(l=>l.substring(0,10))
                 .map(l=>{
                    if(tset[l]){
                       dupCount++;
                    }
                    tset[l]=1;
                 });
           if(dupCount>0){
               // This just replaces each SMT line with the STY group number defined before it
               // The '!#!' and '@' symbols are used as temporary "protecting groups"
               molfile = molfile.replace(/@/g,'!#!')
                            .replace(/STY/g,'@')
                            .replace(/(M[ ][ ]@[ ][ ]1)([ ]*[0-9]*)([^@]*)SMT([ ]*[0-9]*)/g,'$1$2$3SMT$2')
                            .replace(/@/g,'STY')
                            .replace(/!#!/g,'@');
           }
        }
        return molfile;
    }

    setMolecule(molfile: string): void {
        if (this.ketcher != null) {
            this.ketcher.setMolecule(molfile);
        } else if (this.jsdraw != null) {
            // from simple tests, this should push the current molecule down
            // on the undo stack.
            this.jsdraw.pushundo();
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
