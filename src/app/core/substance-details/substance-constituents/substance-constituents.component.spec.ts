import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceConstituentsComponent } from './substance-constituents.component';

describe('SubstanceConstituentsComponent', () => {
  let component: SubstanceConstituentsComponent;
  let fixture: ComponentFixture<SubstanceConstituentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceConstituentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceConstituentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
