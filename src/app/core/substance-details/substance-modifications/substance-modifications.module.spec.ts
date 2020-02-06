import { SubstanceModificationsModule } from './substance-modifications.module';

describe('SubstanceModificationsModule', () => {
  let substanceModificationsModule: SubstanceModificationsModule;

  beforeEach(() => {
    substanceModificationsModule = new SubstanceModificationsModule();
  });

  it('should create an instance', () => {
    expect(substanceModificationsModule).toBeTruthy();
  });
});
