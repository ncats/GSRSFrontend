import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyReferenceComponent } from './apply-reference.component';

describe('ApplyReferenceComponent', () => {
  let component: ApplyReferenceComponent;
  let fixture: ComponentFixture<ApplyReferenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
