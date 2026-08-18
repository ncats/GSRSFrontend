import { ApplicationModule } from './application.module';
import { Router } from '@angular/router';

describe('ApplicationModule', () => {
  let applicationModule: ApplicationModule;

  beforeEach(() => {
    const routerStub = { config: [{ children: [] }] } as unknown as Router;
    applicationModule = new ApplicationModule(routerStub);
  });

  it('should create an instance', () => {
    expect(applicationModule).toBeTruthy();
  });
});
