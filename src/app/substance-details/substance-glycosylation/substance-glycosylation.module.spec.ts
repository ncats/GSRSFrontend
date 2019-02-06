import { SubstanceGlycosylationModule } from './substance-glycosylation.module';

describe('SubstanceGlycosylationModule', () => {
  let substanceGlycosylationModule: SubstanceGlycosylationModule;

  beforeEach(() => {
    substanceGlycosylationModule = new SubstanceGlycosylationModule();
  });

  it('should create an instance', () => {
    expect(substanceGlycosylationModule).toBeTruthy();
  });
});
