import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
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
    this.subscription.unsubscribe();
  }

}
