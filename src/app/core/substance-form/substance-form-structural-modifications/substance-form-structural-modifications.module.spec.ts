import { SubstanceFormStructuralModificationsModule } from './substance-form-structural-modifications.module';

describe('SubstanceFormStructuralModificationsModule', () => {
  let substanceFormStructuralModificationsModule: SubstanceFormStructuralModificationsModule;

  beforeEach(() => {
    substanceFormStructuralModificationsModule = new SubstanceFormStructuralModificationsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormStructuralModificationsModule).toBeTruthy();
  });
});
