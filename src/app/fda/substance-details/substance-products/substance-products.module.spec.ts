import { SubstanceProductsModule } from './substance-products.module';

describe('ProductModule', () => {
  let substanceProductsModule: SubstanceProductsModule;

  beforeEach(() => {
    substanceProductsModule = new SubstanceProductsModule();
  });

  it('should create an instance', () => {
    expect(substanceProductsModule).toBeTruthy();
  });
});
