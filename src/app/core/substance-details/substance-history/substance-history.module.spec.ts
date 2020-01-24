import { SubstanceHistoryModule } from './substance-history.module';

describe('SubstanceHistoryModule', () => {
  let substanceHistoryModule: SubstanceHistoryModule;

  beforeEach(() => {
    substanceHistoryModule = new SubstanceHistoryModule();
  });

  it('should create an instance', () => {
    expect(substanceHistoryModule).toBeTruthy();
  });
});
