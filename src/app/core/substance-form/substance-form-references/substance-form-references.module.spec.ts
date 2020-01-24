import { SubstanceFormReferencesModule } from './substance-form-references.module';

describe('SubstanceFormReferencesModule', () => {
  let substanceFormReferencesModule: SubstanceFormReferencesModule;

  beforeEach(() => {
    substanceFormReferencesModule = new SubstanceFormReferencesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormReferencesModule).toBeTruthy();
  });
});
