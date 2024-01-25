import { SubstanceFormSimplifiedReferencesModule } from './substance-form-simplified-references.module';

describe('SubstanceFormSimplifiedReferencesModule', () => {
  let substanceFormReferencesModule: SubstanceFormSimplifiedReferencesModule;

  beforeEach(() => {
    substanceFormReferencesModule = new SubstanceFormSimplifiedReferencesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormReferencesModule).toBeTruthy();
  });
});
