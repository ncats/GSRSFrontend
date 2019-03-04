import { SubstanceNaLinkagesModule } from './substance-na-linkages.module';

describe('SubstanceNaLinkagesModule', () => {
  let substanceNaLinkagesModule: SubstanceNaLinkagesModule;

  beforeEach(() => {
    substanceNaLinkagesModule = new SubstanceNaLinkagesModule();
  });

  it('should create an instance', () => {
    expect(substanceNaLinkagesModule).toBeTruthy();
  });
});
