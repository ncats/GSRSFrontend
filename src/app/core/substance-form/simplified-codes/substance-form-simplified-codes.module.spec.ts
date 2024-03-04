import { SubstanceFormSimplifiedCodesModule } from './substance-form-simplified-codes.module';

describe('SubstanceFormCodesModule', () => {
  let substanceFormCodesModule: SubstanceFormSimplifiedCodesModule;

  beforeEach(() => {
    substanceFormCodesModule = new SubstanceFormSimplifiedCodesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormCodesModule).toBeTruthy();
  });
});
