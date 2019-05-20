import { MainNotificationModule } from './main-notification.module';

describe('MainNotificationModule', () => {
  let mainNotificationModule: MainNotificationModule;

  beforeEach(() => {
    mainNotificationModule = new MainNotificationModule();
  });

  it('should create an instance', () => {
    expect(mainNotificationModule).toBeTruthy();
  });
});
