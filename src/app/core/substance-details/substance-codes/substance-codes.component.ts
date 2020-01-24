import {AfterViewInit, Component, OnInit} from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import {SubstanceCode, SubstanceDetail} from '../../substance/substance.model';
import {MatDialog} from '@angular/material';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import {UtilsService} from '@gsrs-core/utils';

@Component({
  selector: 'app-substance-codes',
  templateUrl: './substance-codes.component.html',
  styleUrls: ['./substance-codes.component.scss']
})
export class SubstanceCodesComponent extends SubstanceCardBaseFilteredList<SubstanceCode> implements OnInit, AfterViewInit {
  type: string;
  codes: Array<SubstanceCode> = [];
  displayedColumns: string[];
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;

  constructor(
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private utilsService: UtilsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      this.codes = [];
      if (this.substance != null && this.type != null) {
        if (this.type === 'classification') {
          this.displayedColumns = ['classificationTree', 'codeSystem', 'code', 'references'];
        } else {
          this.displayedColumns = ['codeSystem', 'code', 'type', 'description', 'references'];
        }

          this.filterSubstanceCodes();

        if (this.codes != null && this.codes.length) {
          this.filtered = this.codes;
          this.pageChange();

          this.searchControl.valueChanges.subscribe(value => {
            this.filterList(value, this.codes);
          }, error => {
            console.log(error);
          });
        } else {
          this.filtered = [];
        }
      }
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }
  sortData(sort: Sort) {
    const data = this.codes.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      this.pageChange();
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.utilsService.compare(a[sort.active], b[sort.active], isAsc);
    });
    this.pageChange();
  }

  ngAfterViewInit(): void {
  }

  private filterSubstanceCodes(): void {
    if (this.substance.codes && this.substance.codes.length > 0) {
      this.substance.codes.forEach(code => {
        if (code.comments && code.comments.indexOf('|') > -1 && this.type === 'classification') {
          this.codes.push(code);
        } else if (this.type === 'identifiers') {
          this.codes.push(code);
        }
      });
      this.countUpdate.emit(this.codes.length);
    }
  }

  getClassificationTree(comments: string): Array<string> {
    return comments.split('|');
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

