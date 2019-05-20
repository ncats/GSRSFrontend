import { SubstanceCardsModule } from './substance-cards.module';

describe('SubstanceCardsModule', () => {
  let substanceCardsModule: SubstanceCardsModule;

  beforeEach(() => {
    substanceCardsModule = new SubstanceCardsModule();
  });

  it('should create an instance', () => {
    expect(substanceCardsModule).toBeTruthy();
  });
});
