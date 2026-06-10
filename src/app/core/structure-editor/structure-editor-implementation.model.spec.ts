import { EditorImplementation } from './structure-editor-implementation.model';
import { Ketcher } from './structure.editor.model';

describe('EditorImplementation regressions', () => {
  let changeHandler: (operations: Array<{ operation: string }>) => void;
  let rawMolfile: string;
  let getMolfileCalls: number;
  let ketcher: Ketcher;

  beforeEach(() => {
    rawMolfile = [
      '',
      '  Ketcher',
      '',
      '  1  0  0  0  0  0            999 V2000',
      '    0.0000    0.0000    0.0000 C   0  0',
      'M  END',
    ].join('\n');
    getMolfileCalls = 0;
    ketcher = {
      version: '',
      apiPath: '',
      buildDate: '',
      editor: {
        subscribe: (_event: string, handler: typeof changeHandler) => {
          changeHandler = handler;
        },
        event: {
          change: {
            handlers: [],
          },
        },
      },
      getSmiles: () => '',
      saveSmiles: () => Promise.resolve(''),
      getMolfile: () => {
        getMolfileCalls++;
        return Promise.resolve(rawMolfile);
      },
      setMolecule: () => undefined,
      addFragment: () => undefined,
      showMolfile: () => undefined,
    };
  });

  it('does not emit or read Ketcher output for a tracked programmatic load', () => {
    const editor = new EditorImplementation(ketcher);
    const emitted: string[] = [];
    editor.structureUpdated().subscribe(molfile => emitted.push(molfile));

    editor.setMolecule(rawMolfile);
    changeHandler([{ operation: 'Load canvas' }]);

    expect(getMolfileCalls).toBe(0);
    expect(emitted).toEqual([]);
  });

  it('emits the molfile for a real user edit', async () => {
    const editor = new EditorImplementation(ketcher);
    const emitted = new Promise<string>(resolve => {
      editor.structureUpdated().subscribe(resolve);
    });

    changeHandler([{ operation: 'Add atom' }]);

    expect(await emitted).toBe(rawMolfile);
    expect(getMolfileCalls).toBe(1);
  });

  it('does not suppress an untracked user Load canvas operation', async () => {
    const editor = new EditorImplementation(ketcher);
    const emitted = new Promise<string>(resolve => {
      editor.structureUpdated().subscribe(resolve);
    });

    changeHandler([{ operation: 'Load canvas' }]);

    expect(await emitted).toBe(rawMolfile);
    expect(getMolfileCalls).toBe(1);
  });

  it('accepts explicit isotope removal without restoring the old isotope', async () => {
    const isotopeMolfile = rawMolfile.replace('M  END', 'M  ISO  1   1  13\nM  END');
    const editor = new EditorImplementation(ketcher);
    const emitted = new Promise<string>(resolve => {
      editor.structureUpdated().subscribe(resolve);
    });
    editor.setMolecule(isotopeMolfile);
    changeHandler([{ operation: 'Load canvas' }]);

    changeHandler([{
      operation: 'Set atom attribute',
      attribute: 'isotope',
      from: 13,
      to: 0,
    } as any]);

    expect(await emitted).not.toContain('M  ISO');
  });

  it('accepts an explicit isotope mass change as the new trusted value', async () => {
    const isotope204 = rawMolfile.replace('M  END', 'M  ISO  1   1 204\nM  END');
    const isotope206 = rawMolfile.replace('M  END', 'M  ISO  1   1 206\nM  END');
    const editor = new EditorImplementation(ketcher);
    const emitted = new Promise<string>(resolve => {
      editor.structureUpdated().subscribe(resolve);
    });
    editor.setMolecule(isotope204);
    changeHandler([{ operation: 'Load canvas' }]);

    rawMolfile = isotope206;
    changeHandler([{
      operation: 'Set atom attribute',
      attribute: 'isotope',
      from: 204,
      to: 206,
    } as any]);

    const result = await emitted;
    expect(result).toContain('M  ISO  1   1 206');
    expect(result).not.toContain('M  ISO  1   1 204');
  });
});
