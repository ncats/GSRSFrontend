import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StringDecoder } from 'string_decoder';
import { take } from 'rxjs/operators';

import { AuthService } from '@gsrs-core/auth';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { GeneralService } from '../../service/general.service';
import { ProductService } from '../../product/service/product.service';
import { FacetParam } from '@gsrs-core/facets-manager';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { SubstanceDetailsBaseTableDisplay } from './substance-details-base-table-display';
import { SubstanceAdverseEventCvmComponent } from './substance-adverseevent/adverseeventcvm/substance-adverseeventcvm.component';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { productSearchSortValues } from '../../product/products-browse/product-search-sort-values';

@Component({
  selector: 'app-substance-products',
  templateUrl: './substance-products.component.html',
  styleUrls: ['./substance-products.component.scss']
})

export class SubstanceProductsComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, AfterViewInit {

  productCount = 0;
  applicationCount = 0;
  clinicalTrialCount = 0;
  clinicalTrialEuCount = 0;
  advPtCount = 0;
  advDmeCount = 0;
  advCvmCount = 0;
  impuritiesCount = 0;
  ssg4mCount = 0;
  invitroPharmCount = 0;
  invitroPharmScreeningCount = 0;
  invitroPharmSummaryCount = 0;
  provenance = '';
  provenanceList: Array<string> = [];
  datasourceList = '';
  loadingStatus = '';
  showSpinner = false;
  baseDomain: string;
  foundProvenanceList = false;
  loadingComplete = false;
  substanceName = '';
  substanceUuid = '';
  approvalId = '';
  dailyMedIconSrcPath = '';
  phpIdIconSrcPath = '';

  loadedComponents: LoadedComponents;
  products: any;

  // Search variables
  ascDescDir = 'asc';
  //order = '$root_productProvenances_productCodes_productCode';
  order = '^Product Code';
  public provenanceSearchBase = 'root_productProvenances_provenance:';
  public privateSearchBase = 'entity_link_substances:';
  //public privateSearchBase = 'root_productManufactureItems_productLots_productIngredients_substanceKey:';
  public privateSearch?: string;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  public sortValues = productSearchSortValues;

  // Export variables
  privateExport = false;
  disableExport = false;
  etag = '';
  etagAllExport = '';
  canExport: boolean = false;
  canUpdate: boolean = false;

  public displayedColumns: string[] = [
    'view',
    'productCode',
    'productName',
    'labelerName',
    'status',
    'productType',
    'ingredientType',
    'applicationNumber'
  ];

  constructor(
    private router: Router,
    public gaService: GoogleAnalyticsService,
    private productService: ProductService,
    private configService: ConfigService,
    public authService: AuthService,
    private loadingService: LoadingService,
    private generalService: GeneralService,
    private dialog: MatDialog
  ) {
    super(gaService, productService);
  }

  async ngOnInit() {
    this.loadedComponents = this.configService.configData.loadedComponents || null;
    this.canExport = await this.authService.hasSpecificPrivilege('Export Data');
    this.canUpdate = await this.authService.hasSpecificPrivilege('Edit');
    if (this.substance && this.substance.uuid) {

      // Get Substance UUID and Approval ID
      this.substanceUuid = this.substance.uuid;
      this.approvalId = this.substance.approvalID;

      // Get Bdnum for this substance
      this.getSubstanceKey();

      // Use Substance UUID
      this.privateSearch = this.privateSearchBase + '\"' + this.substanceUuid + '\"';

      // Search Product
      this.getSubstanceProducts(null, 'initial');

    } // if substance exists

    this.baseDomain = this.configService.configData.apiUrlDomain;

    // Get dailymed Icon
    this.dailyMedIconSrcPath = `${this.configService.environment.baseHref || ''}assets/icons/fda/icon_dailymed.png`;

    this.phpIdIconSrcPath = `${this.configService.environment.baseHref || ''}assets/icons/fda/icon_phpid.png`;

  }

  ngAfterViewInit() {
  }

  getApplicationCount($event: any) {
    this.applicationCount = $event;
  }

  getClinicalTrialCount($event: any) {
    this.clinicalTrialCount = $event;
  }

  getClinicalTrialEuCount($event: any) {
    this.clinicalTrialEuCount = $event;
  }

  getAdvPtCount($event: any) {
    this.advPtCount = $event;
  }

  getAdvDmeCount($event: any) {
    this.advDmeCount = $event;
  }

  getAdvCvmCount($event: any) {
    this.advCvmCount = $event;
  }

  getImpuritiesCount($event: any) {
    this.impuritiesCount = $event;
  }

  getSsg4mCount($event: any) {
    this.ssg4mCount = $event;
  }

  getInvitroPharmCount($event) {
    this.invitroPharmCount = $event;
  }

  getInvitroPharmScreeningCount($event) {
    this.invitroPharmScreeningCount = $event;
  }

  getInvitroPharmSummaryCount($event) {
    this.invitroPharmSummaryCount = $event;
  }

  getSubstanceKey() {
    // Get Bdnum for this substance
    if (this.substance) {
      // Get Substance Name
      this.substanceName = this.substance._name;
      if (this.substance.codes.length > 0) {
        this.substance.codes.forEach(element => {
          if (element.codeSystem && element.codeSystem === 'BDNUM') {
            if (element.type && element.type === 'PRIMARY') {
              this.bdnum = element.code;
            }
          }
        });
      }
    }
  }

  getProductProvenanceList(): void {

    this.productService.getProductProvenanceList(this.bdnum).subscribe(results => {
      this.provenanceList = results;
      if (this.provenanceList && this.provenanceList.length > 0) {
        this.foundProvenanceList = true;
      }
      this.loadingComplete = true;
    });
  }

  getSubstanceProducts(pageEvent?: PageEvent, searchType?: string) {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const skip = this.page * this.pageSize;

    const subscription = this.productService.getProducts(
      this.order,
      skip,
      this.pageSize,
      this.privateSearch,
      this.privateFacetParams
    ).subscribe(pagingResponse => {
      if (searchType && searchType === 'initial') {
        // Need this to export all the Products, and not by provenance tab
        this.etagAllExport = pagingResponse.etag;

        // Get the provenance lists from the "Provenance" facet
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          let facets = pagingResponse.facets;

          facets.forEach(facet => {
            if (facet) {
              if (facet.name === 'Provenance') {
                let values = facet.values;
                values.forEach(value => {
                  if (value && value.label) {
                    this.provenanceList.push(value.label);
                  }
                })
              }
            }
          });

        } // if facets exists

      } else { // search product by Provenance for the tab selected on the page
        this.productService.totalRecords = pagingResponse.total;
        this.setResultData(pagingResponse.content);
        this.products = pagingResponse.content;
        this.productCount = pagingResponse.total;
        this.etag = pagingResponse.etag;
      }

      // Get Daily Med Url if Product Code Type is NDC CODE
      this.getDailyMedUrlforProductCode();

      // Get PhPID Url if Product Code Type is PhPID
      this.getPhpIdUrlforProductCode();

      // Get RxNorm Url if Product Code Type is RxNorm
      this.getRxNormUrlforProductCode();

      // Sort Product Codes by ascending alphabetically
      this.sortProductCodes();

    }, error => {
      this.showSpinner = false;  // Stop progress spinner
      console.log('error');
    }, () => {
      this.showSpinner = false;  // Stop progress spinner
      subscription.unsubscribe();
    });
    this.loadingStatus = '';
    // this.showSpinner = false;  // Stop progress spinner
  }

  sortProductCodes() {
    this.products.forEach((product, indexProd) => {
      product.productProvenances.forEach((prov, indexProv) => {
        // Sort by Product Code Type, such as NDC CODE 
        prov.productCodes.sort((a, b) => (a.productCodeType < b.productCodeType ? -1 : 1));
      });
    });
  }
  
  getDailyMedUrlforProductCode(): void {
    // Get Daily Med Url from Configuration
    let dailyMedUrlConfig = this.generalService.getDailyMedUrlConfig();

    this.products.forEach((product, indexProd) => {
      product.productProvenances.forEach((prov, indexProv) => {
        prov.productCodes.forEach(prodCode => {

          // if Product Code Type is 'NDC CODE', show Daily Med link on the browse Product page.
          if (prodCode) {
            if (prodCode.productCode) {
              if (prodCode.productCodeType && prodCode.productCodeType === 'NDC CODE') {
                prodCode._dailyMedUrl = dailyMedUrlConfig + prodCode.productCode;
              }
            }
          }
        });
      });
    });
  }

  getPhpIdUrlforProductCode(): void {
    let phpIdUrlConfig = this.generalService.getPhpIdUrlConfig();

    this.products.forEach((product, indexProd) => {
      product.productProvenances.forEach((prov, indexProv) => {
        prov.productCodes.forEach(prodCode => {

          // if Product Code Type is 'PHPID', show PhpID link on the browse Product page.
          if (prodCode) {
            if (prodCode.productCode) {
              if (prodCode.productCodeType && prodCode.productCodeType.trim().toLowerCase() === 'phpid') {
                // If phpId Url exists in the frontend config, get the url and concatenate PhpId code
                if (phpIdUrlConfig) {
                  prodCode._phpIdUrl = phpIdUrlConfig + prodCode.productCode;
                }
              }
            }
          }
        });
      });
    });
  }

  getRxNormUrlforProductCode(): void {
    let rxNormUrlConfig = this.generalService.getRxNormUrlConfig();

    this.products.forEach((product, indexProd) => {
      product.productProvenances.forEach((prov, indexProv) => {
        prov.productCodes.forEach(prodCode => {

          // if Product Code Type is 'RxNorm', show RxNorm link on the browse Product page.
          if (prodCode) {
            if (prodCode.productCode) {
              if (prodCode.productCodeType && prodCode.productCodeType.trim().toLowerCase() === 'rxnorm') {
                // If phpId Url exists in the frontend config, get the url and concatenate PhpId code
                if (rxNormUrlConfig) {
                  prodCode._rxNormUrl = rxNormUrlConfig + prodCode.productCode;
                }
              }
            }
          }
        });
      });
    });
  }

  export() {
    if (this.etagAllExport) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etagAllExport, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          // height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'substanceProduct', 'entity': 'products', 'hideOptionButtons': true }
        });
        // this.overlayContainer.style.zIndex = '1002';
        dialogReference.afterClosed().subscribe(response => {
          // this.overlayContainer.style.zIndex = null;
          const name = response.name;
          const id = response.id;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname, id).subscribe(response => {
              // this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
              this.loadingService.setLoading(false);
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.productCount
                }
              };
              const params = { 'total': this.productCount };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.productService.getApiExportUrl(etag, extension);
  }

  tabSelected($event) {
    if ($event) {
      const evt: any = $event.tab;
      const textLabel: string = evt.textLabel;

      // Get distinct Provenance from server side and display Product data based on the provenance on each tab
      if (textLabel != null) {
        this.loadingStatus = 'Loading data...';
        this.provenance = textLabel;

        // set the current result data to empty or null.
        this.paged = [];

        // Set criterial and search Product based on Substance Key and Provenance
        this.privateSearch = this.privateSearchBase + '\"' + this.substance.uuid + '\" AND ' + this.provenanceSearchBase + this.provenance;

        // Search Product
        this.getSubstanceProducts();
      }

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

      this.getSubstanceProducts();
    }
    return;
  }

}
