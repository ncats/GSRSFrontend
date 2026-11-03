import { ScrollToModule } from './scroll-to.module';

describe('ScrollToModule', () => {
  let scrollNavModule: ScrollToModule;

  beforeEach(() => {
    scrollNavModule = new ScrollToModule();
  });

  it('should create an instance', () => {
    expect(scrollNavModule).toBeTruthy();
  });
});
