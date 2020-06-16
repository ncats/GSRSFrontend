import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSsgDefinitionComponent } from './substance-ssg-definition.component';

describe('SubstanceSsgDefinitionComponent', () => {
  let component: SubstanceSsgDefinitionComponent;
  let fixture: ComponentFixture<SubstanceSsgDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSsgDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsgDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
