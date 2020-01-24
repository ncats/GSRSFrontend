import { SubstanceFormDefinitionModule } from './substance-form-definition.module';

describe('SubstanceFormDefinitionModule', () => {
  let substanceFormDefinitionModule: SubstanceFormDefinitionModule;

  beforeEach(() => {
    substanceFormDefinitionModule = new SubstanceFormDefinitionModule();
  });

  it('should create an instance', () => {
    expect(substanceFormDefinitionModule).toBeTruthy();
  });
});
