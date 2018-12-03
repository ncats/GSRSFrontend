import { MolFile } from './mol-file';

export class EditorStub {

    constructor() {}

    getMolfile(): string {
        return MolFile;
    }

    setMolecule(molfile: string): void {}
}
