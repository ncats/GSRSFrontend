import { SubstanceFormMixtureDetailsModule } from './substance-form-mixture-details.module';

describe('SubstanceFormMixtureDetailsModule', () => {
  let substanceFormMixtureDetailsModule: SubstanceFormMixtureDetailsModule;

  beforeEach(() => {
    substanceFormMixtureDetailsModule = new SubstanceFormMixtureDetailsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormMixtureDetailsModule).toBeTruthy();
  });
});
