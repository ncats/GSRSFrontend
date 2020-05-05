import { SubstanceFormMoietiesModule } from './substance-form-moieties.module';

describe('SubstanceFormMoietiesModule', () => {
  let substanceFormMoietiesModule: SubstanceFormMoietiesModule;

  beforeEach(() => {
    substanceFormMoietiesModule = new SubstanceFormMoietiesModule();
  });

  it('should create an instance', () => {
    expect(substanceFormMoietiesModule).toBeTruthy();
  });
});
