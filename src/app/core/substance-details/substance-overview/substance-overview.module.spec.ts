import { SubstanceOverviewModule } from './substance-overview.module';

describe('SubstanceOverviewModule', () => {
  let substanceOverviewModule: SubstanceOverviewModule;

  beforeEach(() => {
    substanceOverviewModule = new SubstanceOverviewModule();
  });

  it('should create an instance', () => {
    expect(substanceOverviewModule).toBeTruthy();
  });
});
