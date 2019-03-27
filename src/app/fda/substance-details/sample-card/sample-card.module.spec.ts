import { SampleCardModule } from './sample-card.module';

describe('SampleCardModule', () => {
  let sampleCardModule: SampleCardModule;

  beforeEach(() => {
    sampleCardModule = new SampleCardModule();
  });

  it('should create an instance', () => {
    expect(sampleCardModule).toBeTruthy();
  });
});
