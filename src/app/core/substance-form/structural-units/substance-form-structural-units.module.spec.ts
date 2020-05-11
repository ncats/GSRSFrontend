import { SubstanceFormStructuralUnitsModule } from './substance-form-structural-units.module';

describe('SubstanceFormStructuralUnitsModule', () => {
  let substanceFormStructuralUnitsModule: SubstanceFormStructuralUnitsModule;

  beforeEach(() => {
    substanceFormStructuralUnitsModule = new SubstanceFormStructuralUnitsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormStructuralUnitsModule).toBeTruthy();
  });
});
