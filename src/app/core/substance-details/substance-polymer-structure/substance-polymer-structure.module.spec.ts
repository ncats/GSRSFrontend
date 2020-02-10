import { SubstancePolymerStructureModule } from './substance-polymer-structure.module';

describe('SubstancePolymerStructureModule', () => {
  let substancePolymerStructureModule: SubstancePolymerStructureModule;

  beforeEach(() => {
    substancePolymerStructureModule = new SubstancePolymerStructureModule();
  });

  it('should create an instance', () => {
    expect(substancePolymerStructureModule).toBeTruthy();
  });
});
