export interface Editor {
    getMolfile(): string;
    setMolecule(molfile: string): void;
}
