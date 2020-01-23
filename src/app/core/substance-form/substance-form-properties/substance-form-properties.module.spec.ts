import { SubstanceFormPropertiesModule } from './substance-form-properties.module';

describe('SubstanceFormPropertiesModule', () => {
  let substanceFormPropertiesModule: SubstanceFormPropertiesModule;

  beforeEach(() => {
    substanceFormPropertiesModule = new SubstanceFormPropertiesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormPropertiesModule).toBeTruthy();
  });
});
