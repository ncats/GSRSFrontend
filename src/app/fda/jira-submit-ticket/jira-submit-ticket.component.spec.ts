import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraSubmitTicketComponent } from './jira-submit-ticket.component';

describe('JiraSubmitTicketComponent', () => {
  let component: JiraSubmitTicketComponent;
  let fixture: ComponentFixture<JiraSubmitTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JiraSubmitTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraSubmitTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
