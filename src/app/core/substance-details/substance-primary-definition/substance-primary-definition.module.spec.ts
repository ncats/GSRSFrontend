import { SubstancePrimaryDefinitionModule } from './substance-primary-definition.module';

describe('SubstancePrimaryDefinitionModule', () => {
  let substancePrimaryDefinitionModule: SubstancePrimaryDefinitionModule;

  beforeEach(() => {
    substancePrimaryDefinitionModule = new SubstancePrimaryDefinitionModule();
  });

  it('should create an instance', () => {
    expect(substancePrimaryDefinitionModule).toBeTruthy();
  });
});
