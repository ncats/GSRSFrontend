import { ScrollNavModule } from './scroll-nav.module';

describe('ScrollNavModule', () => {
  let scrollNavModule: ScrollNavModule;

  beforeEach(() => {
    scrollNavModule = new ScrollNavModule();
  });

  it('should create an instance', () => {
    expect(scrollNavModule).toBeTruthy();
  });
});
