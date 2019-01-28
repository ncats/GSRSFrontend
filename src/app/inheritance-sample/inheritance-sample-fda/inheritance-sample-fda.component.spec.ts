import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InheritanceSampleFdaComponent } from './inheritance-sample-fda.component';

describe('InheritanceSampleFdaComponent', () => {
  let component: InheritanceSampleFdaComponent;
  let fixture: ComponentFixture<InheritanceSampleFdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InheritanceSampleFdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InheritanceSampleFdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
