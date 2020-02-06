import { GsrsModule } from './gsrs.module';

describe('GsrsModule', () => {
  let gsrsModule: GsrsModule;

  beforeEach(() => {
    gsrsModule = new GsrsModule();
  });

  it('should create an instance', () => {
    expect(gsrsModule).toBeTruthy();
  });
});
