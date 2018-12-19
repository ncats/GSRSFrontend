import { SubstanceNamesModule } from './substance-names.module';

describe('SubstanceNamesModule', () => {
  let substanceNamesModule: SubstanceNamesModule;

  beforeEach(() => {
    substanceNamesModule = new SubstanceNamesModule();
  });

  it('should create an instance', () => {
    expect(substanceNamesModule).toBeTruthy();
  });
});
