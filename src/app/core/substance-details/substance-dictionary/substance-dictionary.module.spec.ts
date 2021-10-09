import { SubstanceDictionaryModule } from './substance-dictionary.module';

describe('SubstanceDictionaryModule', () => {
  let SubstanceDictionaryModule: SubstanceDictionaryModule;

  beforeEach(() => {
    SubstanceDictionaryModule = new SubstanceDictionaryModule();
  });

  it('should create an instance', () => {
    expect(SubstanceDictionaryModule).toBeTruthy();
  });
});
