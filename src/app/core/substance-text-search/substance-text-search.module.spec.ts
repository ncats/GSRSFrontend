import { SubstanceTextSearchModule } from './substance-text-search.module';

describe('TopSearchModule', () => {
  let topSearchModule: SubstanceTextSearchModule;

  beforeEach(() => {
    topSearchModule = new SubstanceTextSearchModule();
  });

  it('should create an instance', () => {
    expect(topSearchModule).toBeTruthy();
  });
});
