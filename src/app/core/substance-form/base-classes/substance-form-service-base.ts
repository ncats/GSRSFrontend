import { OnDestroy } from '@angular/core';
import { Subscription, ReplaySubject } from 'rxjs';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';

export abstract class SubstanceFormServiceBase implements OnDestroy {
    substance: SubstanceDetail;
    subscriptions: Array<Subscription> = [];
    propertyEmitter: ReplaySubject<any>;

    constructor(
        substanceFormService: SubstanceFormService
    ) {
        substanceFormService.substanceUnloaded().subscribe(() => {
            this.ngOnDestroy();
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.propertyEmitter.complete();
    }
}
