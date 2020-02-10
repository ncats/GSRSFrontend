import { StructureEditorModule } from './structure-editor.module';

describe('StructureEditorModule', () => {
  let structureEditorModule: StructureEditorModule;

  beforeEach(() => {
    structureEditorModule = new StructureEditorModule();
  });

  it('should create an instance', () => {
    expect(structureEditorModule).toBeTruthy();
  });
});
