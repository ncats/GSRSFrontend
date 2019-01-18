import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceConceptDefinitionComponent } from './substance-concept-definition.component';

describe('SubstanceConceptDefinitionComponent', () => {
  let component: SubstanceConceptDefinitionComponent;
  let fixture: ComponentFixture<SubstanceConceptDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceConceptDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceConceptDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
