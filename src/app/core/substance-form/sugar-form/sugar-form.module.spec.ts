import { SugarFormModule } from './sugar-form.module';

describe('SugarFormModule', () => {
  let sugarFormModule: SugarFormModule;

  beforeEach(() => {
    sugarFormModule = new SugarFormModule();
  });

  it('should create an instance', () => {
    expect(sugarFormModule).toBeTruthy();
  });
});
