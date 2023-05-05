import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQueryListDialogComponent } from './user-query-list-dialog.component';

describe('UserQueryListDialogComponent', () => {
  let component: UserQueryListDialogComponent;
  let fixture: ComponentFixture<UserQueryListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserQueryListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQueryListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
