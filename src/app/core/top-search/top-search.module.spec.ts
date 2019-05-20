import { TopSearchModule } from './top-search.module';

describe('TopSearchModule', () => {
  let topSearchModule: TopSearchModule;

  beforeEach(() => {
    topSearchModule = new TopSearchModule();
  });

  it('should create an instance', () => {
    expect(topSearchModule).toBeTruthy();
  });
});
