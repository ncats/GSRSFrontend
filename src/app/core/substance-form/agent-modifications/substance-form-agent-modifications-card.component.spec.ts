import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormAgentModificationsCardComponent } from './substance-form-agent-modifications-card.component';

describe('SubstanceFormAgentModificationsComponent', () => {
  let component: SubstanceFormAgentModificationsCardComponent;
  let fixture: ComponentFixture<SubstanceFormAgentModificationsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormAgentModificationsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormAgentModificationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
