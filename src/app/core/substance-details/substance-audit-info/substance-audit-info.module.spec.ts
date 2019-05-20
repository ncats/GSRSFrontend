import { SubstanceAuditInfoModule } from './substance-audit-info.module';

describe('SubstanceAuditInfoModule', () => {
  let substanceAuditInfoModule: SubstanceAuditInfoModule;

  beforeEach(() => {
    substanceAuditInfoModule = new SubstanceAuditInfoModule();
  });

  it('should create an instance', () => {
    expect(substanceAuditInfoModule).toBeTruthy();
  });
});
