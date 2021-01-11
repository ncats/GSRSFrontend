import { SubstanceRelationshipsVisualizationModule } from './substance-relationships-visualization.module';

describe('SubstanceOverviewModule', () => {
  let substanceRelationshipsVisualizationModule: SubstanceRelationshipsVisualizationModule;

  beforeEach(() => {
    substanceRelationshipsVisualizationModule = new SubstanceRelationshipsVisualizationModule();
  });

  it('should create an instance', () => {
    expect(substanceRelationshipsVisualizationModule).toBeTruthy();
  });
});
