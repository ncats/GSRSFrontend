import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UserDownload } from '@gsrs-core/auth/user-downloads/download.model';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
    selector: 'app-user-downloads',
    templateUrl: './user-downloads.component.html',
    styleUrls: ['./user-downloads.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDownloadsComponent {
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  // use aspirin for initial development a05ec20c-8fe2-4e02-ba7f-df69e5e30248
  id = this.activatedRoute.snapshot.params['id'] || null;

  totalSubs?: string;

  downloads = toSignal<Array<UserDownload> | undefined>(
    this.id
      ? of(undefined)
      : this.authService.getAllDownloads().pipe(take(1), map(response => response.downloads)),
    { initialValue: undefined }
  );

  allDownloads() {
    this.router.navigate(['/user-downloads'], {queryParams: {}});
  }

}
