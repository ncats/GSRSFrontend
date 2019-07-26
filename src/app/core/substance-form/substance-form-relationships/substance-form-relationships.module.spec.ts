import { SubstanceFormRelationshipsModule } from './substance-form-relationships.module';

describe('SubstanceFormRelationshipsModule', () => {
  let substanceFormRelationshipsModule: SubstanceFormRelationshipsModule;

  beforeEach(() => {
    substanceFormRelationshipsModule = new SubstanceFormRelationshipsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormRelationshipsModule).toBeTruthy();
  });
});
