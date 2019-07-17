import { ExpandDetailsModule } from './expand-details.module';

describe('ExpandDetailsModule', () => {
  let expandDetailsModule: ExpandDetailsModule;

  beforeEach(() => {
    expandDetailsModule = new ExpandDetailsModule();
  });

  it('should create an instance', () => {
    expect(expandDetailsModule).toBeTruthy();
  });
});
