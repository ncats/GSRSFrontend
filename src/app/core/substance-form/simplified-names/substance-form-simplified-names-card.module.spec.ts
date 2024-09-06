import { SubstanceFormSimplifiedNamesModule } from './substance-form-simplified-names.module';

describe('SubstanceFormNamesModule', () => {
  let substanceFormNamesModule: SubstanceFormSimplifiedNamesModule;

  beforeEach(() => {
    substanceFormNamesModule = new SubstanceFormSimplifiedNamesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormNamesModule).toBeTruthy();
  });
});
