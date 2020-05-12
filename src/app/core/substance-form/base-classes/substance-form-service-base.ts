import { OnDestroy } from '@angular/core';
import { Subscription, ReplaySubject } from 'rxjs';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';

export abstract class SubstanceFormServiceBase<T> {
    substance: SubstanceDetail;
    subscriptions: Array<Subscription> = [];
    propertyEmitter: ReplaySubject<T>;

    constructor(
        public substanceFormService: SubstanceFormService
    ) {
        this.propertyEmitter = new ReplaySubject<T>();
        this.substanceFormService.substanceFormAction.subscribe(action => {
            setTimeout(() => {
                if (action === 'load') {
                    this.initSubtanceForm();
                } else {
                    this.unloadSubstance();
                }
            });
        });
    }

    initSubtanceForm(): void {
    }

    unloadSubstance(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
        this.propertyEmitter.complete();
        this.propertyEmitter = new ReplaySubject<T>();
    }
}
