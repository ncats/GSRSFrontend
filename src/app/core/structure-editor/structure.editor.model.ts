import { Observable } from 'rxjs';

export interface Editor {
    getMolfile(): string;
    getSmiles(): string;
    setMolecule(molfile: string): void;
    structureUpdated(): Observable<string>;
}
