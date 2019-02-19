import { FdaModule } from './fda.module';
import { Router } from '@angular/router';
import { RouterStub } from '../testing/router-stub';

describe('FdaModule', () => {
  let fdaModule: FdaModule;
  let routerStub: Partial<Router>;

  beforeEach(() => {
    routerStub = new RouterStub();
    fdaModule = new FdaModule(routerStub as Router);
  });

  it('should create an instance', () => {
    expect(fdaModule).toBeTruthy();
  });
});
