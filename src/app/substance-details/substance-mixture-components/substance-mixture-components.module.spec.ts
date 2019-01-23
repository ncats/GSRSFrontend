import { SubstanceMixtureComponentsModule } from './substance-mixture-components.module';

describe('SubstanceMixtureComponentsModule', () => {
  let substanceMixtureComponentsModule: SubstanceMixtureComponentsModule;

  beforeEach(() => {
    substanceMixtureComponentsModule = new SubstanceMixtureComponentsModule();
  });

  it('should create an instance', () => {
    expect(substanceMixtureComponentsModule).toBeTruthy();
  });
});
