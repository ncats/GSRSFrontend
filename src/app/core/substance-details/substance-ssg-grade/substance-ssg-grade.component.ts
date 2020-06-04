import { Component, OnInit} from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceDetail, Grade} from '../../substance/substance.model';
import { MatDialog} from '@angular/material';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-substance-ssg-grade',
  templateUrl: './substance-ssg-grade.component.html',
  styleUrls: ['./substance-ssg-grade.component.scss']
})

export class SubstanceSsgGradeComponent extends SubstanceCardBase implements OnInit {
  grade: Grade = {};
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
        && this.substance.specifiedSubstanceG3.grade) {
        this.grade = this.substance.specifiedSubstanceG3.grade;
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
