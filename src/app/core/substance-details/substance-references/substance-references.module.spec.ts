import { SubstanceReferencesModule } from './substance-references.module';

describe('SubstanceReferencesModule', () => {
  let substanceReferencesModule: SubstanceReferencesModule;

  beforeEach(() => {
    substanceReferencesModule = new SubstanceReferencesModule();
  });

  it('should create an instance', () => {
    expect(substanceReferencesModule).toBeTruthy();
  });
});
