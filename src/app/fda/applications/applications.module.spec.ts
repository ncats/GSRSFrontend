import { ApplicationsModule } from './applications.module';

describe('ApplicationsModule', () => {
  let applicationsModule: ApplicationsModule;

  beforeEach(() => {
    applicationsModule = new ApplicationsModule();
  });

  it('should create an instance', () => {
    expect(applicationsModule).toBeTruthy();
  });
});
