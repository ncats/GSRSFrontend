import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import moment from 'moment';

/* Angular Material Imports */
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/* GSRS Core */
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { StructureService } from '@gsrs-core/structure';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';

/* GSRS Impurities */
import { GeneralService } from '../../service/general.service';
import { ImpuritiesService } from '../service/impurities.service';
import { Impurities, ImpuritiesSolutionTable } from '../model/impurities.model';

@Component({
  selector: 'app-impurities-compare',
  templateUrl: './impurities-compare.component.html',
  styleUrls: ['./impurities-compare.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpuritiesCompareComponent implements OnInit, OnDestroy {

  public ELUTION_TYPE_ISOCRATIC = 'ISOCRATIC';
  public ELUTION_TYPE_GRADIENT = 'GRADIENT';

  private _myCanvas: ElementRef;

  public context: CanvasRenderingContext2D;
  public canvasCopy: HTMLCanvasElement;

  dataSource: MatTableDataSource<ImpuritiesSolutionTable>;
  private subscriptions: Array<Subscription> = [];
  displayedColumnsRow: string[][] = [];

  id: string;
  impurities: Impurities;
  substanceName = '';
  isImportFromFile = false;
  selectedImage: string | null = null;

  flagIconSrcPath: string;
  title: string;
  message = '';
  subRelationship: any;
  downloadJsonHref: any;
  jsonFileName: string;

  impuritiesUSP: Impurities;
  impuritiesEP: Impurities;

  // File upload properties
  uspFile: File | null = null;
  epFile: File | null = null;
  uspFileName = '';
  epFileName = '';
  errorMessage = '';
  isFileMode = false; // Track if we're in file upload mode or URL mode

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService,
    private utilsService: UtilsService,
    private structureService: StructureService,
    private loadingService: LoadingService,
    private gaService: GoogleAnalyticsService,
    private mainNotificationService: MainNotificationService,
    private impuritiesService: ImpuritiesService,
    private generalService: GeneralService,
    private titleService: Title,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  @ViewChild('structure_canvas', { static: false }) set myCanvas(content: ElementRef) {
    if (content) {
      this._myCanvas = content;
      this.canvasCopy = <HTMLCanvasElement>this._myCanvas.nativeElement;
      this.context = this.canvasCopy.getContext('2d');
    }
  }

  get canEdit(): boolean {
    return this.authService.hasPrivilege('Edit');
  }

  async ngOnInit() {
    this.loadingService.setLoading(true);

    // Check if we have query params (URL mode) or should use file upload mode
    this.activatedRoute.queryParams.subscribe(params => {
      const uspId = params['usp'];
      const epId = params['ep'];

      if (uspId && epId) {
        // URL mode - load from IDs
        this.isFileMode = false;
        this.getImpurities(uspId, 'USP');
        this.getImpurities(epId, 'EP');
      } else {
        // File upload mode
        this.isFileMode = true;
      }
    });

    this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  // File upload handlers
  onFileSelected(event: Event, type: 'usp' | 'ep'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate JSON file
      if (!file.name.endsWith('.json')) {
        this.errorMessage = 'Please select a valid JSON file';
        this.cdr.markForCheck();
        return;
      }

      if (type === 'usp') {
        this.uspFile = file;
        this.uspFileName = file.name;
      } else {
        this.epFile = file;
        this.epFileName = file.name;
      }

      this.errorMessage = '';
      this.cdr.markForCheck();
    }
  }

  compareFiles(): void {
    if (!this.uspFile || !this.epFile) {
      this.errorMessage = 'Please select both USP and EP JSON files';
      this.cdr.markForCheck();
      return;
    }

    this.loadingService.setLoading(true);
    this.errorMessage = '';

    // Read USP file
    const uspReader = new FileReader();
    uspReader.onload = (e) => {
      try {
        this.impuritiesUSP = JSON.parse(e.target?.result as string);
        console.log("Loaded USP JSON from file:", this.impuritiesUSP);
        
        // Get substance details for USP
        if (this.impuritiesUSP.impuritiesSubstanceList && this.impuritiesUSP.impuritiesSubstanceList.length > 0) {
          this.getSubstanceDetailsbySubstanceUuid(this.impuritiesUSP);
        }
        
        // Read EP file
        const epReader = new FileReader();
        epReader.onload = (e2) => {
          try {
            this.impuritiesEP = JSON.parse(e2.target?.result as string);
            console.log("Loaded EP JSON from file:", this.impuritiesEP);
            
            // Get substance details for EP
            if (this.impuritiesEP.impuritiesSubstanceList && this.impuritiesEP.impuritiesSubstanceList.length > 0) {
              this.getSubstanceDetailsbySubstanceUuid(this.impuritiesEP);
            }
            
            this.loadingService.setLoading(false);
            this.cdr.markForCheck();
          } catch (error) {
            this.errorMessage = 'Error parsing EP JSON file. Please ensure it is valid JSON.';
            console.error('EP JSON parse error:', error);
            this.loadingService.setLoading(false);
            this.cdr.markForCheck();
          }
        };
        epReader.onerror = () => {
          this.errorMessage = 'Error reading EP file';
          this.loadingService.setLoading(false);
          this.cdr.markForCheck();
        };
        epReader.readAsText(this.epFile!);
        
      } catch (error) {
        this.errorMessage = 'Error parsing USP JSON file. Please ensure it is valid JSON.';
        console.error('USP JSON parse error:', error);
        this.loadingService.setLoading(false);
        this.cdr.markForCheck();
      }
    };
    uspReader.onerror = () => {
      this.errorMessage = 'Error reading USP file';
      this.loadingService.setLoading(false);
      this.cdr.markForCheck();
    };
    uspReader.readAsText(this.uspFile);
  }

  clearComparison(): void {
    this.uspFile = null;
    this.epFile = null;
    this.uspFileName = '';
    this.epFileName = '';
    this.impuritiesUSP = null;
    this.impuritiesEP = null;
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  getImpurities(id: string, source: string): void {
    const getImpuritiesSubscribe = this.impuritiesService.getImpuritiesDetails(id).subscribe(response => {
      if (response) {
        this.impurities = response;
        console.log("Get Impurities JSON: " + JSON.stringify(this.impurities));

        if (Object.keys(this.impurities).length > 0) {
          if (source) {
            if (source === 'USP') {
              this.impuritiesUSP = response;
              if (this.impuritiesUSP.impuritiesSubstanceList && this.impuritiesUSP.impuritiesSubstanceList.length > 0) {
                this.getSubstanceDetailsbySubstanceUuid(this.impuritiesUSP);
              }
            } else if (source === 'EP') {
              this.impuritiesEP = response;
              if (this.impuritiesEP.impuritiesSubstanceList && this.impuritiesEP.impuritiesSubstanceList.length > 0) {
                this.getSubstanceDetailsbySubstanceUuid(this.impuritiesEP);
              }
            }
          }
        }
      }
      this.cdr.markForCheck();
    }, error => {
      this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(getImpuritiesSubscribe);
  }

  getSubstanceDetailsbySubstanceUuid(impurities: Impurities): void {
    impurities.impuritiesSubstanceList.forEach((elementRel, indexRel) => {
      if (elementRel.substanceUuid) {
        const impSubNameSubscription = this.generalService.getSubstanceBySubstanceUuid(elementRel.substanceUuid).subscribe(
          substance => {
            if (substance) {
              elementRel.substanceName = substance._name;
              elementRel.approvalID = substance.approvalID;
            }
            this.cdr.markForCheck();
          });
        this.subscriptions.push(impSubNameSubscription);
      }
    });
  }

  private handleSubstanceRetrivalError(): void {
    this.loadingService.setLoading(false);
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/browse-substance']);
    }, 5000);
  }

  // Helper method to format dates
  formatDate(timestamp: number): string {
    if (!timestamp) return 'Not specified';
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  }

  // Helper method to get value or default
  getValue(value: any): string {
    if (value === null || value === undefined || value === '') {
      return 'Not specified';
    }
    return String(value);
  }

  // Helper method to check if array has items
  hasItems(arr: any[]): boolean {
    return arr && arr.length > 0;
  }

  // Helper method to get all tests from a substance
  getAllTests(substance: any): any[] {
    if (!substance || !substance.impuritiesTestList) {
      return [];
    }
    return substance.impuritiesTestList;
  }

  // Helper method to get solution tables
  getSolutionTables(testInfo: any): any[] {
    if (!testInfo || !testInfo.impuritiesSolutionTableList) {
      return [];
    }
    return testInfo.impuritiesSolutionTableList;
  }

  // Helper method to get solution table IDs as comma-separated string
  getSolutionTableIds(testInfo: any): string {
    const tables = this.getSolutionTables(testInfo);
    if (tables.length === 0) return '';
    return tables.map(s => s.id).join(', ');
  }

  // Helper method to get analysis list
  getAnalysisList(testInfo: any): any[] {
    if (!testInfo || !testInfo.impuritiesAnalysisList) {
      return [];
    }
    return testInfo.impuritiesAnalysisList;
  }

  // Helper method to get unspecified impurities for a substance and test index
  getUnspecifiedImpurities(substance: any, testIdx: number): any[] {
    if (!substance || !substance.impuritiesTestList || !substance.impuritiesTestList[testIdx]) {
      return [];
    }
    const test = substance.impuritiesTestList[testIdx];
    return test.impuritiesUnspecifiedList || [];
  }

  // Helper method to get residual solvents
  getResidualSolvents(impurities: any): any[] {
    if (!impurities || !impurities.impuritiesSubstanceList || impurities.impuritiesSubstanceList.length === 0) {
      return [];
    }
    return impurities.impuritiesSubstanceList[0]?.impuritiesResidualSolventsTestList || [];
  }

  // Helper method to get specific tests
  getSpecificTests(impurities: any): any[] {
    if (!impurities || !impurities.impuritiesSubstanceList || impurities.impuritiesSubstanceList.length === 0) {
      return [];
    }
    return impurities.impuritiesSubstanceList[0]?.impuritiesSpecificTestList || [];
  }

  // Helper method to get identity criteria value
  getIdentityCriteriaValue(criteriaList: any[], type: string): string {
    if (!criteriaList || criteriaList.length === 0) return '-';
    const criteria = criteriaList.find(c => c.identityCriteriaType === type);
    return criteria && criteria.amountValue ? String(criteria.amountValue) : '-';
  }

  // Helper method to format impurity limit
  formatImpurityLimit(detail: any): string {
    if (!detail) return 'Not specified';
    const parts: string[] = [];
    if (detail.limitType) parts.push(detail.limitType);
    if (detail.limitValue) parts.push(detail.limitValue);
    if (detail.unit) parts.push(detail.unit);
    return parts.length > 0 ? parts.join(' ') : 'Not specified';
  }
}
