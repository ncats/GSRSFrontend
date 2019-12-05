import { SubstanceFormConstituentsModule } from './substance-form-constituents.module';

describe('SubstanceFormConstituentsModule', () => {
  let substanceFormConstituentsModule: SubstanceFormConstituentsModule;

  beforeEach(() => {
    substanceFormConstituentsModule = new SubstanceFormConstituentsModule();
  });

  it('should create an instance', () => {
    expect(substanceFormConstituentsModule).toBeTruthy();
  });
});
