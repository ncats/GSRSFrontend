import { SubstanceMixtureSourceModule } from './substance-mixture-source.module';

describe('SubstanceMixtureSourceModule', () => {
  let substanceMixtureSourceModule: SubstanceMixtureSourceModule;

  beforeEach(() => {
    substanceMixtureSourceModule = new SubstanceMixtureSourceModule();
  });

  it('should create an instance', () => {
    expect(substanceMixtureSourceModule).toBeTruthy();
  });
});
