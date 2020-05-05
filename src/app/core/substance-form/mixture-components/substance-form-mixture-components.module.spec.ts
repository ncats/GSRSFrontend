import { SubstanceFormMixtureComponentsModule } from './substance-form-mixture-components.module';

describe('SubstanceFormMixtureComponentsModule', () => {
  let substanceFormMixtureComponentsModule: SubstanceFormMixtureComponentsModule;

  beforeEach(() => {
    substanceFormMixtureComponentsModule = new SubstanceFormMixtureComponentsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormMixtureComponentsModule).toBeTruthy();
  });
});
