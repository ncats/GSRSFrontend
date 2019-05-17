import { SubstanceSearchFormModule } from './substance-search-form.module';

describe('SubstanceSearchFormModule', () => {
  let substanceSearchFormModule: SubstanceSearchFormModule;

  beforeEach(() => {
    substanceSearchFormModule = new SubstanceSearchFormModule();
  });

  it('should create an instance', () => {
    expect(substanceSearchFormModule).toBeTruthy();
  });
});
