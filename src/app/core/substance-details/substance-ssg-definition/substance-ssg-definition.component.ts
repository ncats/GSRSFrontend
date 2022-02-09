import { Component, OnInit} from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceDetail, Definition} from '../../substance/substance.model';
import { MatDialog} from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-substance-ssg-definition',
  templateUrl: './substance-ssg-definition.component.html',
  styleUrls: ['./substance-ssg-definition.component.scss']
})

export class SubstanceSsgDefinitionComponent extends SubstanceCardBase implements OnInit {
  definition: Definition = {};
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;
  count = 0;

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
      if (this.substance != null && this.substance.specifiedSubstanceG3 != null
        && this.substance.specifiedSubstanceG3.definition) {
        this.definition = this.substance.specifiedSubstanceG3.definition;
        this.count = 1;
      }
      this.countUpdate.emit(this.count);
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
