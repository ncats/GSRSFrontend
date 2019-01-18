import { SubstanceConceptDefinitionModule } from './substance-concept-definition.module';

describe('SubstanceConceptDefinitionModule', () => {
  let substanceConceptDefinitionModule: SubstanceConceptDefinitionModule;

  beforeEach(() => {
    substanceConceptDefinitionModule = new SubstanceConceptDefinitionModule();
  });

  it('should create an instance', () => {
    expect(substanceConceptDefinitionModule).toBeTruthy();
  });
});
