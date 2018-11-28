import { StructureEditorModule } from './structure-editor.module';

describe('StructureEditorModule', () => {
  let structureEditorModule: StructureEditorModule;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    structureEditorModule = new StructureEditorModule();
  });

  it('should create an instance', () => {
    expect(structureEditorModule).toBeTruthy();
  });
});
