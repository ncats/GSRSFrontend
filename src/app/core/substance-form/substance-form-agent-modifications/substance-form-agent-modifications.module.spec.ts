import { SubstanceFormAgentModificationsModule } from './substance-form-agent-modifications.module';

describe('SubstanceFormAgentModificationsModule', () => {
  let substanceFormAgentModificationsModule: SubstanceFormAgentModificationsModule;

  beforeEach(() => {
    substanceFormAgentModificationsModule = new SubstanceFormAgentModificationsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormAgentModificationsModule).toBeTruthy();
  });
});
