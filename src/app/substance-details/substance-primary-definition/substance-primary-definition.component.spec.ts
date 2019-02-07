import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstancePrimaryDefinitionComponent } from './substance-primary-definition.component';

describe('SubstancePrimaryDefinitionComponent', () => {
  let component: SubstancePrimaryDefinitionComponent;
  let fixture: ComponentFixture<SubstancePrimaryDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstancePrimaryDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstancePrimaryDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
