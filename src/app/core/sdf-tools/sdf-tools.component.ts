import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { SDF_IMPORT_ENABLED, SDF_TOOLS_TABS, SdfToolsTab } from './sdf-tools.constants';

@Component({
  selector: 'app-sdf-tools',
  templateUrl: './sdf-tools.component.html',
  styleUrls: ['./sdf-tools.component.scss'],
  standalone: false
})
export class SdfToolsComponent implements OnInit, OnDestroy {
  selectedIndex = 0;
  isPfdaVersion = false;
  readonly importEnabled = SDF_IMPORT_ENABLED;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.isPfdaVersion = this.configService.configData?.isPfdaVersion === true;

    const paramsSubscription = this.activatedRoute.queryParamMap.subscribe(params => {
      const tab = params.get('tab') as SdfToolsTab;
      const index = SDF_TOOLS_TABS.indexOf(tab);
      this.selectedIndex = index > -1 ? index : 0;
    });
    this.subscriptions.push(paramsSubscription);
  }

  onTabChanged(event: MatTabChangeEvent): void {
    const tab = SDF_TOOLS_TABS[event.index];
    if (!tab) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
