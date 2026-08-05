import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentModificationFormComponent } from './agent-modification-form.component';

describe('AgentModificationFormComponent', () => {
  let component: AgentModificationFormComponent;
  let fixture: ComponentFixture<AgentModificationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentModificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentModificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
