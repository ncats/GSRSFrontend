import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDownloadsComponent } from './user-downloads.component';

describe('UserDownloadsComponent', () => {
  let component: UserDownloadsComponent;
  let fixture: ComponentFixture<UserDownloadsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
