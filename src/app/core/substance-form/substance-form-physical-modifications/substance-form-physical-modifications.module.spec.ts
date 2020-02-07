import { SubstanceFormPhysicalModificationsModule } from './substance-form-physical-modifications.module';

describe('SubstanceFormPhysicalModificationsModule', () => {
  let substanceFormPhysicalModificationsModule: SubstanceFormPhysicalModificationsModule;

  beforeEach(() => {
    substanceFormPhysicalModificationsModule = new SubstanceFormPhysicalModificationsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormPhysicalModificationsModule).toBeTruthy();
  });
});
