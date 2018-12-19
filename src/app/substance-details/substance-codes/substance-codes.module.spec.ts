import { SubstanceCodesModule } from './substance-codes.module';

describe('SubstanceCodesModule', () => {
  let substanceCodesModule: SubstanceCodesModule;

  beforeEach(() => {
    substanceCodesModule = new SubstanceCodesModule();
  });

  it('should create an instance', () => {
    expect(substanceCodesModule).toBeTruthy();
  });
});
