import { InxightModule } from './inxight.module';

describe('InxightModule', () => {
  let inxightModule: InxightModule;

  beforeEach(() => {
    inxightModule = new InxightModule();
  });

  it('should create an instance', () => {
    expect(inxightModule).toBeTruthy();
  });
});
