import {AfterViewInit, Component, OnInit} from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {SubstanceDetail, SubstanceNote} from '../../substance/substance.model';
import { MatDialog } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { ReadMoreComponent } from '@gsrs-core/substance-details/substance-notes/read-more/read-more.component';
import {Subject} from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-substance-notes',
  templateUrl: './substance-notes.component.html',
  styleUrls: ['./substance-notes.component.scss']
})
export class SubstanceNotesComponent extends SubstanceCardBase implements OnInit {
  notes: Array<SubstanceNote> = [];
  displayedColumns: string[] = ['note', 'references'];
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;

  constructor(
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.notes != null && this.substance.notes.length) {
        this.notes = this.substance.notes;
      }
      this.countUpdate.emit(this.notes.length);
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();
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
