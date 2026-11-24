import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { AuthService } from '@gsrs-core/auth';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ImpuritiesService } from '../../impurities/service/impurities.service';
import { GeneralService } from '../../service/general.service';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { SubstanceDetailsBaseTableDisplay } from '../substance-products/substance-details-base-table-display';
import { Impurities, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria } from '../../impurities/model/impurities.model';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { impuritiesSearchSortValues } from '../../impurities/impurities-search-sort-values';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-substance-impurities',
  templateUrl: './substance-impurities.component.html',
  styleUrls: ['./substance-impurities.component.scss'],
  standalone: true,
  imports: [RouterLink, MatTooltipModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule]
})
export class SubstanceImpuritiesComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {

  @Input() substanceUuid: string;
  @Input() substanceName: string;
  @Output() countImpuritiesOut: EventEmitter<number> = new EventEmitter<number>();
  private subscriptions: Array<Subscription> = [];
  parentSubstance: string;
  parentSubstanceUuid: string;
  showSpinner = false;
  impurities: Array<Impurities>;
  totalImpurities = 0;
  impuritiesCount = 0;
  impuritiesTestTotal = 0;
  pageIndex = 0;
  pageSize = 5;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';
  public sortValues = impuritiesSearchSortValues;
  order = '$root_productSubstanceName';
  ascDescDir = 'desc';

  selectedUSP: any = null;
  selectedEP: any = null;

  displayedColumns: string[] = [
    'compare',
    'productSubstanceName',
    'sourceType',
    'source',
    'sourceId',
    'type',
    'specType',
    'parentSubstance',
    'relatedSubstance'
  ];

  constructor(
    private router: Router,
    public gaService: GoogleAnalyticsService,
    private impuritiesService: ImpuritiesService,
    private generalService: GeneralService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    super(gaService, impuritiesService);
  }

  // Getters, not fields, so they always reflect the current privilege signal.
  get canUpdate(): boolean {
    return this.authService.hasPrivilege('Edit');
  }

  get canExport(): boolean {
    return this.authService.hasPrivilege('Export Data');
  }

  ngOnInit() {
    if (this.substance && this.substance.uuid) {
      this.substanceUuid = this.substance.uuid;
      this.getImpuritiesBySubstanceUuid();
      this.impuritiesListExportUrl();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  searchImpurities() {
    this.privateSearchTerm = this.substanceUuid;
    const skip = this.pageIndex * this.pageSize;
    const subscription = this.impuritiesService.searchImpurities(
      skip,
      this.pageSize,
      this.privateSearchTerm,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.setResultData(pagingResponse.content);
        this.impurities = pagingResponse.content;
        this.impuritiesCount = pagingResponse.total;
        this.countImpuritiesOut.emit(this.impuritiesCount);
        this.etag = pagingResponse.etag;
      }, error => {
      }, () => {
        subscription.unsubscribe();
      });
  }

  getImpuritiesBySubstanceUuid(pageEvent?: PageEvent): void {
    this.showSpinner = true;

    this.setPageEvent(pageEvent);
    const skip = this.page * this.pageSize;

    this.impuritiesService.getImpuritiesBySubstanceUuid(
      this.order,
      skip,
      this.pageSize,
      this.substanceUuid,
      this.privateFacetParams).subscribe(results => {
        this.impuritiesService.totalRecords = results.total;
        this.impurities = results.content;

        // Load Impurities Test Details by Substance Uuid
        this.loadImpuritiesTestDetails();

        this.setResultData(this.impurities);

        this.totalImpurities = results.total;

        this.etag = results.etag;
        this.countImpuritiesOut.emit(this.totalImpurities);
      });
    this.showSpinner = false;
  }

  loadImpuritiesTestDetails() {
    this.impurities.forEach((element, index) => {
      element.impuritiesSubstanceList.forEach((elementSub, indexSub) => {

        if (elementSub.substanceUuid) {
          if (elementSub.substanceUuid === this.substanceUuid) {
            elementSub._parentSubstanceName = this.substanceName;
            elementSub._parentSubstanceUuid = elementSub.substanceUuid;
          }
        }
        elementSub.impuritiesTestList.forEach((elementTest, indexTest) => {

          elementTest.impuritiesDetailsList.forEach((elementDetail, indexDetail) => {

            if (elementDetail.relatedSubstanceUuid != null) {
              if (elementDetail.relatedSubstanceUuid === this.substanceUuid) {
                const subSubscription = this.generalService.getSubstanceNamesBySubstanceUuid(elementSub.substanceUuid).subscribe(substanceNames => {
                  let subNames = substanceNames;

                  subNames.forEach((names, index) => {
                    if (names.displayName === true) {
                      elementSub._parentSubstanceName = names.name;
                      elementSub._parentSubstanceUuid = elementSub.substanceUuid;
                    }
                  });
                });
                this.subscriptions.push(subSubscription);
              }
            }
          });
        });
      });
    });
  }

  getSubstanceNames(substanceUuid: string): string {
    let preferredTerm;
    if (substanceUuid) {
      const subSubscription = this.generalService.getSubstanceNamesBySubstanceUuid(substanceUuid).subscribe(substanceNames => {
        let subNames = substanceNames;

        subNames.forEach((names, index) => {
          if (names.displayName === true) {
            preferredTerm = names.name;
          }
        });
      });
      this.subscriptions.push(subSubscription);
      return preferredTerm;
    }
  }

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          width: '700px',
          data: { 'extension': extension, 'type': 'substanceImpurities', 'entity': 'impurities', 'hideOptionButtons': true }
        });
        dialogReference.afterClosed().subscribe(response => {
          const name = response.name;
          const id = response.id;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname, id).subscribe(response => {
              this.loadingService.setLoading(false);
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.totalImpurities
                }
              };
              const params = { 'total': this.totalImpurities };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.impuritiesService.getApiExportUrl(etag, extension);
  }

  impuritiesListExportUrl() {
    if (this.substanceUuid != null) {
      this.exportUrl = this.impuritiesService.getImpuritiesListExportUrl(this.substanceUuid);
    }
  }

  sortData(sort: Sort) {
    if (sort.active) {
      const orderIndex = this.displayedColumns.indexOf(sort.active).toString();
      this.ascDescDir = sort.direction;
      this.sortValues.forEach(sortValue => {
        if (sortValue.displayedColumns && sortValue.direction) {
          if (this.displayedColumns[orderIndex] === sortValue.displayedColumns && this.ascDescDir === sortValue.direction) {
            this.order = sortValue.value;
          }
        }
      });
      this.getImpuritiesBySubstanceUuid();
    }
    return;
  }

  // Checkbox comparison methods
  onCompareCheckboxChange(impurities: any, event: MatCheckboxChange): void {
    console.log('Checkbox clicked:', impurities.source, impurities.id, event.checked);

    if (event.checked) {
      if (impurities.source === 'USP') {
        this.selectedUSP = impurities;
        console.log('Selected USP:', this.selectedUSP);
      } else if (impurities.source === 'EP') {
        this.selectedEP = impurities;
        console.log('Selected EP:', this.selectedEP);
      }
    } else {
      if (impurities.source === 'USP') {
        this.selectedUSP = null;
        console.log('Unselected USP');
      } else if (impurities.source === 'EP') {
        this.selectedEP = null;
        console.log('Unselected EP');
      }
    }

    this.cdr.markForCheck();
  }

  isSelected(impurities: any): boolean {
    if (!impurities) return false;

    if (impurities.source === 'USP') {
      return this.selectedUSP?.id === impurities.id;
    } else if (impurities.source === 'EP') {
      return this.selectedEP?.id === impurities.id;
    }
    return false;
  }

  canCompare(): boolean {
    return this.selectedUSP !== null && this.selectedEP !== null;
  }

  navigateToCompare(): void {
    if (this.canCompare()) {
      console.log('Navigating to compare:', this.selectedUSP.id, this.selectedEP.id);
      this.router.navigate(['/impurities/compare'], {
        queryParams: {
          usp: this.selectedUSP.id,
          ep: this.selectedEP.id
        }
      });
    } else {
      console.warn('Cannot compare - both USP and EP must be selected');
    }
  }

  clearSelections(): void {
    this.selectedUSP = null;
    this.selectedEP = null;
    this.cdr.markForCheck();
  }
}
