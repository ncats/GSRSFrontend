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
            return this.jsdraw.getMolfile();
        } else {
            return null;
        }
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
                    const molFile = this.jsdraw.getMolfile();
                    observer.next(molFile);
                };
            }
        });
    }
}
