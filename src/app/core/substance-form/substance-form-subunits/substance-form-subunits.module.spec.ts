import { SubstanceFormSubunitsModule } from './substance-form-subunits.module';

describe('SubstanceFormSubunitsModule', () => {
  let substanceFormSubunitsModule: SubstanceFormSubunitsModule;

  beforeEach(() => {
    substanceFormSubunitsModule = new SubstanceFormSubunitsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormSubunitsModule).toBeTruthy();
  });
});
