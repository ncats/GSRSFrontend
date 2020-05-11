import { SubstanceFormOtherLinksModule } from './substance-form-other-links.module';

describe('SubstanceFormOtherLinksModule', () => {
  let substanceFormOtherLinksModule: SubstanceFormOtherLinksModule;

  beforeEach(() => {
    substanceFormOtherLinksModule = new SubstanceFormOtherLinksModule();
  });

  it('should create an instance', () => {
    expect(substanceFormOtherLinksModule).toBeTruthy();
  });
});
