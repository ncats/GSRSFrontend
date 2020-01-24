import { SubstanceFormNotesModule } from './substance-form-notes.module';

describe('SubstanceFormNotesModule', () => {
  let substanceFormNotesModule: SubstanceFormNotesModule;

  beforeEach(() => {
    substanceFormNotesModule = new SubstanceFormNotesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormNotesModule).toBeTruthy();
  });
});
