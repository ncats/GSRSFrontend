import { SubstanceFormSugarsModule } from './substance-form-sugars.module';

describe('SubstanceFormSugarsModule', () => {
  let substanceFormSugarsModule: SubstanceFormSugarsModule;

  beforeEach(() => {
    substanceFormSugarsModule = new SubstanceFormSugarsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormSugarsModule).toBeTruthy();
  });
});
