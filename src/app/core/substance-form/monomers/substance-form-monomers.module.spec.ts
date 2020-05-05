import { SubstanceFormMonomersModule } from './substance-form-monomers.module';

describe('SubstanceFormCodesModule', () => {
  let substanceFormCodesModule: SubstanceFormMonomersModule;

  beforeEach(() => {
    substanceFormCodesModule = new SubstanceFormMonomersModule();
  });

  it('should create an instance', () => {
    expect(substanceFormCodesModule).toBeTruthy();
  });
});
