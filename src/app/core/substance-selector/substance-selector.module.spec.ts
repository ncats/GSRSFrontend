import { SubstanceSelectorModule } from './substance-selector.module';

describe('SubstanceSelectorModule', () => {
  let substanceSelectorModule: SubstanceSelectorModule;

  beforeEach(() => {
    substanceSelectorModule = new SubstanceSelectorModule();
  });

  it('should create an instance', () => {
    expect(substanceSelectorModule).toBeTruthy();
  });
});
