import { SubstanceVariantConceptsModule } from './substance-variant-concepts.module';

describe('SubstanceVariantConceptsModule', () => {
  let substanceVariantConceptsModule: SubstanceVariantConceptsModule;

  beforeEach(() => {
    substanceVariantConceptsModule = new SubstanceVariantConceptsModule();
  });

  it('should create an instance', () => {
    expect(substanceVariantConceptsModule).toBeTruthy();
  });
});
