import { SubstanceMoietiesModule } from './substance-moieties.module';

describe('SubstanceMoietiesModule', () => {
  let substanceMoietiesModule: SubstanceMoietiesModule;

  beforeEach(() => {
    substanceMoietiesModule = new SubstanceMoietiesModule();
  });

  it('should create an instance', () => {
    expect(substanceMoietiesModule).toBeTruthy();
  });
});
