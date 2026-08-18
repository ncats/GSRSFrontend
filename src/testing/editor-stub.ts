import { of } from 'rxjs';
import { MolFile } from './mol-file';

export class EditorStub {

    getMolfile = jasmine.createSpy('getMolfile').and.returnValue(of(MolFile));

    getSmiles = jasmine.createSpy('getSmiles').and.returnValue(of(''));

    setMolecule = jasmine.createSpy('setMolecule').and.returnValue(null);

    structureUpdated = jasmine.createSpy('structureUpdated').and.returnValue(of(''));
}
