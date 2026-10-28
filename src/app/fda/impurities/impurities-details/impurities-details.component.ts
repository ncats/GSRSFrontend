import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as moment from 'moment';

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
  selector: 'app-impurities-details',
  templateUrl: './impurities-details.component.html',
  styleUrls: ['./impurities-details.component.scss'],
  standalone: false
})
export class ImpuritiesDetailsComponent implements OnInit, OnDestroy {


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
  canEdit: boolean = false;
  title: string;
  message = '';
  subRelationship: any;
  downloadJsonHref: any;
  jsonFileName: string;

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
    private dialog: MatDialog
  ) { }

  @ViewChild('structure_canvas', { static: false }) set myCanvas(content: ElementRef) {
    if (content) {
      this._myCanvas = content;
      this.canvasCopy = <HTMLCanvasElement>this._myCanvas.nativeElement;
      this.context = this.canvasCopy.getContext('2d');
    }
  }

  async ngOnInit() {
    this.loadingService.setLoading(true);

    this.canEdit = await this.authService.hasSpecificPrivilege('Edit');
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id != null) {
      this.title = "Impurities Details";

      this.getImpurities();
    } else {
      const action = this.activatedRoute.snapshot.queryParams['action'] || null;

      if (action && action === 'import' && window.history.state) { // IMPORT IMPURITIES
        this.title = "Impurities Extractor From PDF File";
        this.isImportFromFile = true;

        const record = window.history.state.record;
        const response = JSON.parse(record);
        if (response) {
          this.impurities = response;
          if (!this.impurities.impuritiesAdditionalRequirements) {
            this.impurities.impuritiesAdditionalRequirements = {};
          }

          this.getSubstanceDetailsbySubstanceUuid();

          this.getSubstanceDetailsbySubstanceName();
        }
      }
    }
    this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getImpurities(): void {
    const getImpuritiesSubscribe = this.impuritiesService.getImpuritiesDetails(this.id).subscribe(response => {
      this.impurities = response;
      if (Object.keys(this.impurities).length > 0) {

        this.titleService.setTitle(`Impurities Details`);

        this.getSubstanceDetailsbySubstanceUuid();
      }
    }, error => {
      this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(getImpuritiesSubscribe);
  }

  getSubstanceDetailsbySubstanceUuid() {
    // Get Substance Name for SubstanceUuid in SubstanceList
    this.impurities.impuritiesSubstanceList.forEach((elementRel, indexRel) => {
      if (elementRel.substanceUuid) {
        const impSubNameSubscription = this.generalService.getSubstanceBySubstanceUuid(elementRel.substanceUuid).subscribe
          (substance => {
            if (substance) {
              elementRel.substanceName = substance._name;
              elementRel.approvalID = substance.approvalID;
            }
          });
        this.subscriptions.push(impSubNameSubscription);
      }
    });

    // Get Substance Name for SubstanceUuid in ImpuritiesDetailsList
    this.impurities.impuritiesSubstanceList.forEach((elementRelSub) => {
      elementRelSub.impuritiesTestList.forEach((elementRelTest, indexTest) => {

        elementRelTest.impuritiesDetailsList.forEach((elementRelImpuDet) => {
          if (elementRelImpuDet.relatedSubstanceUuid) {
            const impDetNameSubscription = this.generalService.getSubstanceBySubstanceUuid
              (elementRelImpuDet.relatedSubstanceUuid)
              .subscribe(substance => {
                if (substance) {
                  elementRelImpuDet.substanceName = substance._name;
                  elementRelImpuDet.relatedSubstanceUnii = substance.approvalID;

                }
              });
            this.subscriptions.push(impDetNameSubscription);
          }
        });

        // assign Mobile Phase list to datasource to display on table
        this.dataSource = new MatTableDataSource(elementRelTest.impuritiesSolutionTableList);

        // Get Mobile Phase
        this.getMobilPhase(elementRelTest, indexTest);

      }); // Loop: elementRelSub.impuritiesTestList
    });

    // Get Substance Name for SubstanceUuid in ImpuritiesResidualSolventsList
    this.impurities.impuritiesSubstanceList.forEach((elementSub) => {
      elementSub.impuritiesResidualSolventsTestList.forEach((elementResidualSolTest) => {
        elementResidualSolTest.impuritiesResidualSolventsList.forEach((elementResidual) => {
          if (elementResidual.relatedSubstanceUuid) {
            const impResidualNameSubscription = this.generalService.getSubstanceBySubstanceUuid
              (elementResidual.relatedSubstanceUuid).subscribe(substance => {
                if (substance) {
                  elementResidual.substanceName = substance._name;
                  elementResidual.relatedSubstanceUnii = substance.approvalID;
                }
              });
            this.subscriptions.push(impResidualNameSubscription);
          }
        });
      });
    });

    // Get Substance Name for SubstanceUuid in ImpuritiesInorganicList
    this.impurities.impuritiesSubstanceList.forEach((elementSub) => {
      elementSub.impuritiesInorganicTestList.forEach((elementInorganicTest) => {
        elementInorganicTest.impuritiesInorganicList.forEach((elementInorganic) => {
          if (elementInorganic.relatedSubstanceUuid) {
            const impInorganicNameSubscription = this.generalService.getSubstanceBySubstanceUuid
              (elementInorganic.relatedSubstanceUuid).subscribe(substance => {
                if (substance) {
                  elementInorganic.substanceName = substance._name;
                  elementInorganic.relatedSubstanceUnii = substance.approvalID;
                }
              });
            this.subscriptions.push(impInorganicNameSubscription);
          }
        });
      });
    });

  }

  getSubstanceDetailsbySubstanceName() {

    // Get Substance Name for Impurities in ImpuritiesDetailsList
    this.impurities.impuritiesSubstanceList.forEach((elementRelSub) => {
      elementRelSub.impuritiesTestList.forEach((elementRelTest, indexTest) => {

        elementRelTest.impuritiesDetailsList.forEach((elementRelImpuDet) => {
          if (elementRelImpuDet.relatedSubstanceUuid) {
            const impDetNameSubscription = this.generalService.getSubstanceBySubstanceUuid
              (elementRelImpuDet.relatedSubstanceUuid)
              .subscribe(substance => {
                if (substance) {
                  elementRelImpuDet.substanceName = substance._name;
                  elementRelImpuDet.relatedSubstanceUnii = substance.approvalID;
                }
              });
            this.subscriptions.push(impDetNameSubscription);
          }
        });

        // assign Mobile Phase list to datasource to display on table
        this.dataSource = new MatTableDataSource(elementRelTest.impuritiesSolutionTableList);

        // Get Mobile Phase
        this.getMobilPhase(elementRelTest, indexTest);

      }); // Loop: elementRelSub.impuritiesTestList
    });

    // Get Substance Name for SubstanceUuid in ImpuritiesResidualSolventsList
    this.impurities.impuritiesSubstanceList.forEach((elementSub) => {
      elementSub.impuritiesResidualSolventsTestList.forEach((elementResidualSolTest) => {
        elementResidualSolTest.impuritiesResidualSolventsList.forEach((elementResidual) => {
          if (elementResidual.relatedSubstanceUuid) {
            const impResidualNameSubscription = this.generalService.getSubstanceBySubstanceUuid
              (elementResidual.relatedSubstanceUuid).subscribe(substance => {
                if (substance) {
                  elementResidual.substanceName = substance._name;
                  elementResidual.relatedSubstanceUnii = substance.approvalID;
                }
              });
            this.subscriptions.push(impResidualNameSubscription);
          }
        });
      });
    });

    // Get Substance Name for SubstanceUuid in ImpuritiesInorganicList
    this.impurities.impuritiesSubstanceList.forEach((elementSub) => {
      elementSub.impuritiesInorganicTestList.forEach((elementInorganicTest) => {
        elementInorganicTest.impuritiesInorganicList.forEach((elementInorganic) => {
          if (elementInorganic.relatedSubstanceUuid) {
            const impInorganicNameSubscription = this.generalService.getSubstanceBySubstanceUuid
              (elementInorganic.relatedSubstanceUuid).subscribe(substance => {
                if (substance) {
                  elementInorganic.substanceName = substance._name;
                  elementInorganic.relatedSubstanceUnii = substance.approvalID;
                }
              });
            this.subscriptions.push(impInorganicNameSubscription);
          }
        });
      });
    });

  }

  getMobilPhase(elementRelTest: any, indexTest: number) {
    if (elementRelTest.impuritiesSolutionList) {
      if (elementRelTest.impuritiesSolutionList.length > 0) {

        let displayedColumns = ['Time (min)'];

        const tableList = elementRelTest.impuritiesSolutionTableList;
        const firstRow = tableList && tableList.length > 0 ? tableList[0] : null;

        elementRelTest.impuritiesSolutionList.forEach((solution, index) => {
          if (solution && solution.solutionLetter) {

            // Default fallback column name
            let columnName = 'Solution ' + solution.solutionLetter + ' (%)';

            if (firstRow) {
              if (index === 0 && firstRow.solutionAHeader) {
                columnName = firstRow.solutionAHeader;
              } else if (index === 1 && firstRow.solutionBHeader) {
                columnName = firstRow.solutionBHeader;
              }
            }

            // Only push if not already in the list to prevent duplicates
            if (!displayedColumns.includes(columnName)) {
              displayedColumns.push(columnName);
            }

            this.displayedColumnsRow[indexTest] = displayedColumns;
          }
        });

      }
    }
  }

  getSubstancePreferredName(substanceUuid: string) {
    let name = '';
    const getSubDetailsSubscribe = this.generalService.getSubstanceBySubstanceUuid(substanceUuid).subscribe(substance => {
      if (substance) {
        name = substance._name;
      }
    });
    this.subscriptions.push(getSubDetailsSubscribe);
  }

  private handleSubstanceRetrivalError() {
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

  openInRegisterForm() {
    const imp = JSON.stringify(this.impurities);
    this.router.navigateByUrl('/impurities/register?action=import', { state: { record: imp } });
  }

  getCharCodes(text: string): string {
    if (!text) return '';
    return Array.from(text).map(c => `${c}:${c.charCodeAt(0)}`).join(' ');
  }

  toSubscriptHtml(text: string): SafeHtml {
    if (!text) return '';

    // Change 0 to O
    text = text.replace(/([A-Za-z]\d*)\s*0\s*(\d)/g, '$1O$2');

    // Change "C 17" to "C17"
    let result = text.replace(/([A-Z])\s+(\d+)/g, '$1$2');

    // Numeric subscripts
    result = result.replace(/([A-Za-z])(\d+)/g, '$1<sub>$2</sub>');

    // Variable subscripts
    result = result.replace(/\b(r)(u|s|U|S)\b/gi, '$1<sub>$2</sub>');
    result = result.replace(/\b(C)(s|u|S|U)\b/g, '$1<sub>$2</sub>');

    result = result.replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>');

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

  toSuperscriptHtml(name: string): SafeHtml {
    if (!name) return '';
    const formatted = name
      .replace(/([A-Za-z])(\d+)(?=[^a-zA-Z\d]|$)/g, '$1<sup>$2</sup>')
      .replace(/([A-Za-z])'/g, '$1<sup>′</sup>')
      .replace(/([A-Za-z])\*/g, '$1<sup>*</sup>');
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }

  saveJSON(): void {
    let json = this.cleanImpurities();

    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'impurities_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'impurities_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let cleanImpurities = this.cleanImpurities();

    let data = { jsonData: cleanImpurities, jsonFilename: jsonFilename };

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  cleanImpurities(): any {
    const copiedImpurities = _.cloneDeep(this.impurities);

    return copiedImpurities;
  }

  editStructureSearch(url: string): void {

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['url'] = url;
    navigationExtras.queryParams['type'] = 'similarity';

    this.router.navigate(['/structure-search'], navigationExtras);
  }

  createImage(url: string, name: string): void {
    const img = new Image();

    img.onload = () => {
      // Create canvas in memory (Bypasses Angular DOM lifecycle completely)
      const canvasCopy = document.createElement('canvas');
      const context = canvasCopy.getContext('2d');

      if (!context) {
        console.error("Failed to get 2D context");
        return;
      }

      // Initial draw
      canvasCopy.width = img.width;
      canvasCopy.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      let image = canvasCopy.toDataURL();

      // Compress data url to below molvec max
      if (image.length > 100000) {
        image = canvasCopy.toDataURL('image/jpeg', 100000 / image.length);
      }

      // Calculate new dimensions if too large
      let originalWidth = img.width;
      let originalHeight = img.height;

      while ((img.height > 700) || (img.width > 900)) {
        img.height = img.height * .9;
        img.width = img.width * .9;
      }

      // If dimensions changed, redraw AND update the base64 string
      if (img.width !== originalWidth || img.height !== originalHeight) {
        context.clearRect(0, 0, canvasCopy.width, canvasCopy.height);
        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        // You must update the 'image' variable after resizing!
        image = canvasCopy.toDataURL('image/jpeg', 1.0);
      }

      // Send to backend
      this.getMolFromMolvec(image, name);
    };

    img.onerror = (error) => {
      console.error("Failed to load image.", error);
    };

    // Set src LAST to prevent race conditions
    img.src = url;
  }

  getMolFromMolvec(image: any, name: string) {
    this.structureService.molvec(image).subscribe((response: any) => {
      // Extract the SMILES string (verify the exact property name in your API response)
      const smilesString = response.smiles;

      this.registerSubstance(smilesString, name);

    });
  }

  registerSubstance(smiles: string, name: string) {
    if (!smiles) {
      console.warn('No SMILES structure provided');
      // return;
    }

    let url = "";
    if (
      this.configService.configData &&
      this.configService.configData.gsrsHomeBaseUrl
    ) {
      url =
        this.configService.configData.gsrsHomeBaseUrl +
        "/substances/register/chemical?importStructure=" +
        encodeURIComponent(smiles) +
        "&importName=" +
        encodeURIComponent(name);
    } else {
      const baseUrl = window.location.href.replace(this.router.url, "");
      url =
        baseUrl +
        this.router.serializeUrl(
          this.router.createUrlTree(['/substances/register/chemical'], {
            queryParams: { importStructure: smiles, importName: name }
          })
        );
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }


  // This is what goes into openModal
  openModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  // You will also need this to close it
  closeModal(): void {
    this.selectedImage = null;
  }


}
