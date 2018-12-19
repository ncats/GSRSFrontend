import { SubstanceRelationshipsModule } from './substance-relationships.module';

describe('SubstanceRelationshipsModule', () => {
  let substanceRelationshipsModule: SubstanceRelationshipsModule;

  beforeEach(() => {
    substanceRelationshipsModule = new SubstanceRelationshipsModule();
  });

  it('should create an instance', () => {
    expect(substanceRelationshipsModule).toBeTruthy();
  });
});
