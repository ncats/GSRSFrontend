import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormAgentModificationsComponent } from './substance-form-agent-modifications.component';

describe('SubstanceFormAgentModificationsComponent', () => {
  let component: SubstanceFormAgentModificationsComponent;
  let fixture: ComponentFixture<SubstanceFormAgentModificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormAgentModificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormAgentModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
