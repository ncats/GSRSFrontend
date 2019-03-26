import { SubstanceNaSugarsModule } from './substance-na-sugars.module';

describe('SubstanceNaSugarsModule', () => {
  let substanceNaSugarsModule: SubstanceNaSugarsModule;

  beforeEach(() => {
    substanceNaSugarsModule = new SubstanceNaSugarsModule();
  });

  it('should create an instance', () => {
    expect(substanceNaSugarsModule).toBeTruthy();
  });
});
