import { SubstanceFormProteinDetailsModule } from './substance-form-protein-details.module';

describe('SubstanceFormProteinDetailsModule', () => {
  let substanceFormProteinDetailsModule: SubstanceFormProteinDetailsModule;

  beforeEach(() => {
    substanceFormProteinDetailsModule = new SubstanceFormProteinDetailsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormProteinDetailsModule).toBeTruthy();
  });
});
