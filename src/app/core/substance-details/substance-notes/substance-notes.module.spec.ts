import { SubstanceNotesModule } from './substance-notes.module';

describe('SubstanceNotesModule', () => {
  let substanceNotesModule: SubstanceNotesModule;

  beforeEach(() => {
    substanceNotesModule = new SubstanceNotesModule();
  });

  it('should create an instance', () => {
    expect(substanceNotesModule).toBeTruthy();
  });
});
