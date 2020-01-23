import { SubstanceMonomersModule } from './substance-monomers.module';

describe('SubstanceMonomersModule', () => {
  let substanceMonomersModule: SubstanceMonomersModule;

  beforeEach(() => {
    substanceMonomersModule = new SubstanceMonomersModule();
  });

  it('should create an instance', () => {
    expect(substanceMonomersModule).toBeTruthy();
  });
});
