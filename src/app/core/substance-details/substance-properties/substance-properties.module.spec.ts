import { SubstancePropertiesModule } from './substance-properties.module';

describe('SubstancePropertiesModule', () => {
  let substancePropertiesModule: SubstancePropertiesModule;

  beforeEach(() => {
    substancePropertiesModule = new SubstancePropertiesModule();
  });

  it('should create an instance', () => {
    expect(substancePropertiesModule).toBeTruthy();
  });
});
