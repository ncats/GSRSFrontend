import { SubstanceFormGlycosylationModule } from './substance-form-glycosylation.module';

describe('SubstanceFormGlycosylationModule', () => {
  let substanceFormGlycosylationModule: SubstanceFormGlycosylationModule;

  beforeEach(() => {
    substanceFormGlycosylationModule = new SubstanceFormGlycosylationModule();
  });

  it('should create an instance', () => {
    expect(substanceFormGlycosylationModule).toBeTruthy();
  });
});
