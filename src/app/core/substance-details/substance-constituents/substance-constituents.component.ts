import { Component, OnInit } from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {UtilsService} from '@gsrs-core/utils';
import {Constituent, SubstanceAmount, SubstanceDetail} from '@gsrs-core/substance';
import {Subject} from 'rxjs';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-substance-constituents',
  templateUrl: './substance-constituents.component.html',
  styleUrls: ['./substance-constituents.component.scss']
})
export class SubstanceConstituentsComponent extends SubstanceCardBaseFilteredList<Constituent> implements OnInit {
  constituents: Array<Constituent>;
  substanceUpdated = new Subject<SubstanceDetail>();
  displayedColumns: string[] = ['Substance', 'Role', 'Amount', 'References'];
  private overlayContainer: HTMLElement;

  constructor(
    private utilsService: UtilsService,
    public gaService: GoogleAnalyticsService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,

  ) { super(gaService); }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      if (substance != null && substance.specifiedSubstance != null && substance.specifiedSubstance.constituents) {
        this.constituents = substance.specifiedSubstance.constituents;
        this.filtered = this.substance.specifiedSubstance.constituents;
        this.pageChange();

        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.constituents, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
      }
      this.countUpdate.emit(this.constituents.length);
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  public toString(amount: SubstanceAmount): string {
    return this.utilsService.displayAmount(amount);
  }

  openModal(templateRef) {

    this.gaService.sendEvent(this.analyticsEventCategory, 'button', 'references view');

    const dialogRef = this.dialog.open(templateRef, {
      minWidth: '40%',
      maxWidth: '90%'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }
}
