import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdaInheritanceSampleComponent } from './fda-inheritance-sample.component';

describe('FdaInheritanceSampleComponent', () => {
  let component: FdaInheritanceSampleComponent;
  let fixture: ComponentFixture<FdaInheritanceSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdaInheritanceSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdaInheritanceSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
