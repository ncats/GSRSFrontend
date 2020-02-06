import { NameResolverModule } from './name-resolver.module';

describe('NameResolverModule', () => {
  let nameResolverModule: NameResolverModule;

  beforeEach(() => {
    nameResolverModule = new NameResolverModule();
  });

  it('should create an instance', () => {
    expect(nameResolverModule).toBeTruthy();
  });
});
