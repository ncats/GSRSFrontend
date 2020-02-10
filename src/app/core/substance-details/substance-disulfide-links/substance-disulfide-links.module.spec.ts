import { SubstanceDisulfideLinksModule } from './substance-disulfide-links.module';

describe('SubstanceDisulfideLinksModule', () => {
  let substanceDisulfideLinksModule: SubstanceDisulfideLinksModule;

  beforeEach(() => {
    substanceDisulfideLinksModule = new SubstanceDisulfideLinksModule();
  });

  it('should create an instance', () => {
    expect(substanceDisulfideLinksModule).toBeTruthy();
  });
});
