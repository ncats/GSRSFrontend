import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-jira-submit-ticket',
  templateUrl: './jira-submit-ticket.component.html',
  styleUrls: ['./jira-submit-ticket.component.scss']
})
export class JiraSubmitTicketComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
    this.loadJiraScript();
    this.initCollectorDialog();
  }

  ngAfterViewInit() {
  }

  loadJiraScript() {
    const src = 'https://cnigsllc.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-nh6v6l/b/0/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=558f42b6';

    const node = document.createElement('script');
    node.src = src;
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  initCollectorDialog() {
    const text = 'window.ATL_JQ_PAGE_PROPS = {"triggerFunction": function (showCollectorDialog) {window.showCollectorDialog = showCollectorDialog}};';
    const node = document.createElement('script');
    node.type = 'text/javascript';
    node.innerHTML = text;
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  createTicket() {
    (window as any).showCollectorDialog();
  }

}
