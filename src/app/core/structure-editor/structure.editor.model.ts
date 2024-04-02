import { Observable } from 'rxjs';

export interface Editor {
    getMolfile(): Observable<string>;
    getSmiles(): Observable<string>;
    setMolecule(molfile: string): void;
    structureUpdated(): Observable<string>;
}
