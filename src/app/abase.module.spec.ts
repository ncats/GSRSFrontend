import { AbaseModule } from './abase.module';

describe('AbaseModule', () => {
  let abaseModule: AbaseModule;

  beforeEach(() => {
    abaseModule = new AbaseModule();
  });

  it('should create an instance', () => {
    expect(abaseModule).toBeTruthy();
  });
});
