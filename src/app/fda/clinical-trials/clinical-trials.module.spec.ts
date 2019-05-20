import { ClinicalTrialsModule } from './clinical-trials.module';

describe('ClinicalTrialsModule', () => {
  let clinicalTrialsModule: ClinicalTrialsModule;

  beforeEach(() => {
    clinicalTrialsModule = new ClinicalTrialsModule();
  });

  it('should create an instance', () => {
    expect(clinicalTrialsModule).toBeTruthy();
  });
});
