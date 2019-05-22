import { SubstanceFormOverviewModule } from './substance-form-overview.module';

describe('SubstanceFormOverviewModule', () => {
  let substanceFormOverviewModule: SubstanceFormOverviewModule;

  beforeEach(() => {
    substanceFormOverviewModule = new SubstanceFormOverviewModule();
  });

  it('should create an instance', () => {
    expect(substanceFormOverviewModule).toBeTruthy();
  });
});
