import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { MainNotificationService } from '@gsrs-core/main-notification/main-notification.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification/notification.model';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  productId: number;
  product: any;

  constructor(
    private producService: ProductService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.productId = this.activatedRoute.snapshot.params['id'];
    if (this.productId != null) {
      this.getSubstance();
    } else {
      this.handleSubstanceRetrivalError();
    }
  }

  getSubstance(): void {
    this.producService.getProduct(this.productId).subscribe(response => {
      this.product = response;
      console.log(this.product);
      this.loadingService.setLoading(false);
    }, error => {
      this.handleSubstanceRetrivalError();
    });
  }

  private handleSubstanceRetrivalError() {
    this.loadingService.setLoading(false);
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/browse-substance']);
    }, 5000);
  }
}
