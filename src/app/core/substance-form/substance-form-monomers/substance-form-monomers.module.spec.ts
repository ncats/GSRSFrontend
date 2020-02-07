import { SubstanceFormCodesModule } from './substance-form-codes.module';

describe('SubstanceFormCodesModule', () => {
  let substanceFormCodesModule: SubstanceFormCodesModule;

  beforeEach(() => {
    substanceFormCodesModule = new SubstanceFormCodesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormCodesModule).toBeTruthy();
  });
});
