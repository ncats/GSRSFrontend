import { StructureDetailsModule } from './structure-details.module';

describe('StructureDetailsModule', () => {
  let structureDetailsModule: StructureDetailsModule;

  beforeEach(() => {
    structureDetailsModule = new StructureDetailsModule();
  });

  it('should create an instance', () => {
    expect(structureDetailsModule).toBeTruthy();
  });
});
