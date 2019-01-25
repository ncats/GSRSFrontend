import { FdaModule } from './fda.module';

describe('FdaModule', () => {
  let fdaModule: FdaModule;

  beforeEach(() => {
    fdaModule = new FdaModule();
  });

  it('should create an instance', () => {
    expect(fdaModule).toBeTruthy();
  });
});
