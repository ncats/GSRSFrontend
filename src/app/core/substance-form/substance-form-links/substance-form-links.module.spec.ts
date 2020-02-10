import { SubstanceFormLinksModule } from './substance-form-links.module';

describe('SubstanceFormLinksModule', () => {
  let substanceFormLinksModule: SubstanceFormLinksModule;

  beforeEach(() => {
    substanceFormLinksModule = new SubstanceFormLinksModule();
  });

  it('should create an instance', () => {
    expect(substanceFormLinksModule).toBeTruthy();
  });
});
