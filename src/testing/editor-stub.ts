import { of } from 'rxjs';
import { vi } from 'vitest';
import { MolFile } from './mol-file';

export class EditorStub {

    getMolfile = vi.fn().mockReturnValue(of(MolFile));

    getSmiles = vi.fn().mockReturnValue(of(''));

    setMolecule = vi.fn().mockReturnValue(null);

    structureUpdated = vi.fn().mockReturnValue(of(''));
}
