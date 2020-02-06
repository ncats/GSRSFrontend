import { SubstanceFormStructureModule } from './substance-form-structure.module';

describe('SubstanceFormStructureModule', () => {
  let substanceFormStructureModule: SubstanceFormStructureModule;

  beforeEach(() => {
    substanceFormStructureModule = new SubstanceFormStructureModule();
  });

  it('should create an instance', () => {
    expect(substanceFormStructureModule).toBeTruthy();
  });
});
