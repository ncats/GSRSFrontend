import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../loading.service';
import { Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    imports: [MatProgressBarModule, MatProgressSpinnerModule]
})
export class LoadingComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription: Subscription;

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.subscription = this.loadingService.loadingEvent.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
