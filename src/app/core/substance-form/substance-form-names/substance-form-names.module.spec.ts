import { SubstanceFormNamesModule } from './substance-form-names.module';

describe('SubstanceFormNamesModule', () => {
  let substanceFormNamesModule: SubstanceFormNamesModule;

  beforeEach(() => {
    substanceFormNamesModule = new SubstanceFormNamesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormNamesModule).toBeTruthy();
  });
});
