import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstancePolymerStructureComponent } from './substance-polymer-structure.component';

describe('SubstancePolymerStructureComponent', () => {
  let component: SubstancePolymerStructureComponent;
  let fixture: ComponentFixture<SubstancePolymerStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstancePolymerStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstancePolymerStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
