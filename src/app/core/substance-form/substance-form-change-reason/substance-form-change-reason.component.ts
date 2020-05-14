import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { SubstanceFormService } from '../substance-form.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-change-reason',
  templateUrl: './substance-form-change-reason.component.html',
  styleUrls: ['./substance-form-change-reason.component.scss']
})
export class SubstanceFormChangeReasonComponent extends SubstanceFormBase implements OnInit, OnDestroy {
  changeReasonControl = new FormControl();
  subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Change Reason');
    this.substanceFormService.ready().subscribe(() => {
      this.setHiddenState();
    });
    const changeReasonSubscription = this.substanceFormService.changeReason.subscribe(changeReason => {
      this.changeReasonControl.setValue(changeReason);
    });
    this.subscriptions.push(changeReasonSubscription);
    const valueSubscription = this.changeReasonControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(changeReason => {
      this.substanceFormService.updateChangeReason(changeReason);
    });
    this.subscriptions.push(valueSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  setHiddenState(): void {
    const uuid = this.substanceFormService.getUuid();

    if (uuid == null) {
      this.hiddenStateUpdate.emit(true);
    }
  }
}
