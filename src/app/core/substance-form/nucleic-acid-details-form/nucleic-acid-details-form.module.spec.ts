import { NucleicAcidDetailsFormModule } from './nucleic-acid-details-form.module';

describe('NucleicAcidDetailsFormModule', () => {
  let nucleicAcidDetailsFormModule: NucleicAcidDetailsFormModule;

  beforeEach(() => {
    nucleicAcidDetailsFormModule = new NucleicAcidDetailsFormModule();
  });

  it('should create an instance', () => {
    expect(nucleicAcidDetailsFormModule).toBeTruthy();
  });
});
