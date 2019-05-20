import { ReferencesManagerModule } from './references-manager.module';

describe('ReferencesManagerModule', () => {
  let referencesManagerModule: ReferencesManagerModule;

  beforeEach(() => {
    referencesManagerModule = new ReferencesManagerModule();
  });

  it('should create an instance', () => {
    expect(referencesManagerModule).toBeTruthy();
  });
});
