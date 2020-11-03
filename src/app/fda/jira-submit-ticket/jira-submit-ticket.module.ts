import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { JiraSubmitTicketComponent } from './jira-submit-ticket.component';

@NgModule({
  declarations: [JiraSubmitTicketComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class JiraSubmitTicketModule { }
