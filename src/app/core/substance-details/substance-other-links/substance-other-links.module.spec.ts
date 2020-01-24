import { SubstanceOtherLinksModule } from './substance-other-links.module';

describe('SubstanceOtherLinksModule', () => {
  let substanceOtherLinksModule: SubstanceOtherLinksModule;

  beforeEach(() => {
    substanceOtherLinksModule = new SubstanceOtherLinksModule();
  });

  it('should create an instance', () => {
    expect(substanceOtherLinksModule).toBeTruthy();
  });
});
