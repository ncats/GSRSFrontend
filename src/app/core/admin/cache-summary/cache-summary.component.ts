import { Component, OnInit, OnDestroy } from '@angular/core';
import { HealthInfo } from '@gsrs-core/admin/admin-objects.model';
import { AuthService } from '@gsrs-core/auth';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cache-summary',
  templateUrl: './cache-summary.component.html',
  styleUrls: ['./cache-summary.component.scss']
})
export class CacheSummaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['database', 'driver', 'product', 'latency', 'connected'];
  health: HealthInfo;
  sub: Subscription;
  constructor(
     private adminService: AdminService
  ) { }

  ngOnInit() {
    this.sub = this.adminService.getEnvironmentHealth().subscribe(response => {
          this.health = response;
      });
  }

  ngOnDestroy() {
      this.sub.unsubscribe();
  }

}
