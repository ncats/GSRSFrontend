import { SubstanceFormModule } from './substance-form.module';

describe('SubstanceFormModule', () => {
  let substanceFormModule: SubstanceFormModule;

  beforeEach(() => {
    substanceFormModule = new SubstanceFormModule();
  });

  it('should create an instance', () => {
    expect(substanceFormModule).toBeTruthy();
  });
});
