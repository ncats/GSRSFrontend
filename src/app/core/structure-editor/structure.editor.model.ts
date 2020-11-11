import { Observable } from 'rxjs';

export interface Editor {
    jsdraw?: any;
    getMolfile(): string;
    getSmiles(): string;
    setMolecule(molfile: string): void;
    structureUpdated(): Observable<string>;
}
