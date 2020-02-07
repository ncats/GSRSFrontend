import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvInputComponent } from './cv-input.component';

describe('CvInputComponent', () => {
  let component: CvInputComponent;
  let fixture: ComponentFixture<CvInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
