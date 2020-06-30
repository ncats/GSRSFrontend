import { Component, OnInit} from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceDetail, SubstanceRelated} from '../../substance/substance.model';
import { MatDialog } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-substance-ssg-parent-substance',
  templateUrl: './substance-ssg-parent-substance.component.html',
  styleUrls: ['./substance-ssg-parent-substance.component.scss']
})

export class SubstanceSsgParentSubstanceComponent extends SubstanceCardBase implements OnInit {
  parentSubstance: SubstanceRelated = {};
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
        && this.substance.specifiedSubstanceG3.parentSubstance) {
        this.parentSubstance = this.substance.specifiedSubstanceG3.parentSubstance;
        this.count = 1;
      }
      this.countUpdate.emit(this.count);
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

}
