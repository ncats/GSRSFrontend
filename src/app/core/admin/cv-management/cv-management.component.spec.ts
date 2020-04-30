import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvManagementComponent } from './cv-management.component';

describe('CvManagementComponent', () => {
  let component: CvManagementComponent;
  let fixture: ComponentFixture<CvManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
