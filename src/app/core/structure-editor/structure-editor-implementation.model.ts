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
            console.log(xml);

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');
            console.log(xmlDoc);

            console.log(xmlDoc.getElementsByName('a'));
            // var charges = _.chain($(xml).find('a[i]'))
            //     .map(function (a) {
            //         var ai = $(a).attr('i');
            //         var ac = $(a).attr('c');
            //         if(typeof ac === 'undefined'){
            //             ac=0;
            //         }
            //         var o = {
            //             'i': (aai++),
            //             'c': ac - 0
            //         };
            //         o.toString = function () {
            //             return leftPad(o.i + '', 4) + leftPad(o.c + '', 4);
            //         };
            //         return o;
            //     })
            //     .filter(function (a){
            //         return a.c!=0;
            //     })
            //     .value();
            // if (charges.length > 0) {
            //     var chgCount=function(count){
            //         return 'M  CHG' + leftPad(count + '', 3);
            //     };

            //     return _.chain(charges)
            //         .chunk(8)
            //         .map(function(c){ return chgCount(c.length) +
            //             _.chain(c)
            //                 .map(function(ic){return ic.toString();})
            //                 .value()
            //                 .join('');
            //         })
            //         .value()
            //         .join('\n');
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
