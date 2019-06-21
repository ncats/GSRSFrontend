import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormDefinitionComponent } from './substance-form-definition.component';

describe('SubstanceFormDefinitionComponent', () => {
  let component: SubstanceFormDefinitionComponent;
  let fixture: ComponentFixture<SubstanceFormDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
