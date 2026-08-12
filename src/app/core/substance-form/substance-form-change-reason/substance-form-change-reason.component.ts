import { ChangeDetectionStrategy, Component, OnInit, inject, DestroyRef, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { SubstanceFormService } from '../substance-form.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-substance-form-change-reason',
  templateUrl: './substance-form-change-reason.component.html',
  styleUrls: ['./substance-form-change-reason.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubstanceFormChangeReasonComponent extends SubstanceFormBase implements OnInit {
  private readonly substanceFormService = inject(SubstanceFormService);
  private readonly destroyRef = inject(DestroyRef);

  readonly changeReasonControl = new FormControl<string | null>(null);
  readonly isNewRecord = signal(true);
  readonly fieldLabel = computed(() =>
    this.isNewRecord() ? 'Comment' : 'Change Reason'
  );

  readonly placeholderText = computed(() =>
    this.isNewRecord()
      ? 'Optional comment about this new registration'
      : 'Describe why you are making this change'
  );

  readonly hintText = computed(() =>
    this.isNewRecord()
      ? 'This comment is optional for new registrations.'
      : 'If left blank, will auto-fill based on changes: "Information Added", "Form Updated", or "Information Deleted".'
  );

  private readonly userHasTypedInSession = signal(false);
  private readonly initialLoadComplete = signal(false);

  ngOnInit(): void {
    this.initializeOnServiceReady();
    this.subscribeToChangeReasonUpdates();
    this.subscribeToUserInput();
    
  }

  private initializeOnServiceReady(): void {
    this.substanceFormService.ready()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isNewRecord.set(this.substanceFormService.isNewRecord());
        this.updateHiddenState();
        this.clearHistoricalValueIfEditing();
        this.menuLabelUpdate.emit(this.fieldLabel());
      });
  }

  private subscribeToChangeReasonUpdates(): void {
    this.substanceFormService.changeReason
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(changeReason => {
        if (!this.initialLoadComplete()) {
          this.handleInitialLoad(changeReason);
        }
      });
  }

 
  private handleInitialLoad(changeReason: string | null): void {
    const value = this.isNewRecord() ? changeReason : null;
    this.changeReasonControl.setValue(value, { emitEvent: false });
    this.initialLoadComplete.set(true);
  }

  
  private subscribeToUserInput(): void {
    this.changeReasonControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(changeReason => {
        if (changeReason && changeReason.trim().length > 0) {
          this.userHasTypedInSession.set(true);
        }
        this.substanceFormService.updateChangeReason(changeReason);
      });
  }

  private updateHiddenState(): void {
    this.hiddenStateUpdate.emit(this.isNewRecord());
  }

  private clearHistoricalValueIfEditing(): void {
    if (!this.isNewRecord()) {
      this.substanceFormService.clearChangeReasonForEdit();
    }
  }

  resetSessionState(): void {
    this.userHasTypedInSession.set(false);
    this.initialLoadComplete.set(false);
    this.changeReasonControl.setValue(null, { emitEvent: false });
  }
}
