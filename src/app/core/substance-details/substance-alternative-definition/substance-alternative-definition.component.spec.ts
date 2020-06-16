import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAlternativeDefinitionComponent } from './substance-alternative-definition.component';

describe('SubstanceAlternativeDefinitionComponent', () => {
  let component: SubstanceAlternativeDefinitionComponent;
  let fixture: ComponentFixture<SubstanceAlternativeDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceAlternativeDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAlternativeDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
