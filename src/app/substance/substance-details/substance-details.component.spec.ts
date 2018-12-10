import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDetailsComponent } from './substance-details.component';

describe('SubstanceDetailsComponent', () => {
  let component: SubstanceDetailsComponent;
  let fixture: ComponentFixture<SubstanceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
