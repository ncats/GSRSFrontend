import { MolFile } from './mol-file';

export class EditorStub {

    getMolfile = jasmine.createSpy('getMolfile').and.returnValue(MolFile);

    setMolecule = jasmine.createSpy('setMolecule').and.returnValue(null);
}
