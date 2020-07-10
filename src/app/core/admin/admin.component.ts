import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  activeTab: number;
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const tab = this.activatedRoute.snapshot.queryParams['function'] || 'cache';
    switch (tab) {
      case 'cache': this.activeTab = 0; break;
      case 'user': this.activeTab = 1; break;
      case 'data': this.activeTab = 2; break;
      case 'cv': this.activeTab = 3; break;
      case 'jobs': this.activeTab = 4; break;
      case 'files': this.activeTab = 5; break;
      default: this.activeTab = 0; break;
  }
}

}
