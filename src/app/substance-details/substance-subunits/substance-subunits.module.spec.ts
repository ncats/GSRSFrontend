import { SubstanceSubunitsModule } from './substance-subunits.module';

describe('SubstanceSubunitsModule', () => {
  let substanceSubunitsModule: SubstanceSubunitsModule;

  beforeEach(() => {
    substanceSubunitsModule = new SubstanceSubunitsModule();
  });

  it('should create an instance', () => {
    expect(substanceSubunitsModule).toBeTruthy();
  });
});
