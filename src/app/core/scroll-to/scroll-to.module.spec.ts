import { ScrollNavModule } from './scroll-to.module';

describe('ScrollNavModule', () => {
  let scrollNavModule: ScrollNavModule;

  beforeEach(() => {
    scrollNavModule = new ScrollNavModule();
  });

  it('should create an instance', () => {
    expect(scrollNavModule).toBeTruthy();
  });
});
