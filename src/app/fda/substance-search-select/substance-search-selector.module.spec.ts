import { SubstanceSearchSelectorModule } from './substance-search-selector.module';

describe('SubstanceSearchSelectorModule', () => {
  let substanceSearchSelectorModule: SubstanceSearchSelectorModule;

  beforeEach(() => {
    substanceSearchSelectorModule = new SubstanceSearchSelectorModule();
  });

  it('should create an instance', () => {
    expect(substanceSearchSelectorModule).toBeTruthy();
  });
});
