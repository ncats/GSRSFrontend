import { SubstanceFormDisulfideLinksModule } from './substance-form-disulfide-links.module';

describe('SubstanceFormDisulfideLinksModule', () => {
  let substanceFormDisulfideLinksModule: SubstanceFormDisulfideLinksModule;

  beforeEach(() => {
    substanceFormDisulfideLinksModule = new SubstanceFormDisulfideLinksModule();
  });

  it('should create an instance', () => {
    expect(substanceFormDisulfideLinksModule).toBeTruthy();
  });
});
