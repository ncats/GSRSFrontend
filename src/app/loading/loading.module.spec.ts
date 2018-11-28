import { LoadingModule } from './loading.module';

describe('LoadingModule', () => {
  let loadingModule: LoadingModule;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    loadingModule = new LoadingModule();
  });

  it('should create an instance', () => {
    expect(loadingModule).toBeTruthy();
  });
});
