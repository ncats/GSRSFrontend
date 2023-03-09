import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceDetail, SubstanceReference } from '../../substance/substance.model';
import { MatDialog } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { ReadMoreComponent } from '@gsrs-core/substance-details/substance-notes/read-more/read-more.component';
import { Subject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TagSelectorComponent } from '@gsrs-core/substance-form/tag-selector/tag-selector.component';

@Component({
  selector: 'app-substance-display-image',
  templateUrl: './substance-display-image.component.html',
  styleUrls: ['./substance-display-image.component.scss']
})

export class SubstanceDisplayImageComponent extends SubstanceCardBase implements OnInit {
  references: Array<SubstanceReference> = [];
  displayedColumns: string[] = ['note', 'references'];
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;
  displayImagetag: string;

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
      if (this.substance != null && this.substance.references != null && this.substance.references.length) {
        this.references = this.substance.references;
      }
      // this.countUpdate.emit(this.references.length);
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

}
