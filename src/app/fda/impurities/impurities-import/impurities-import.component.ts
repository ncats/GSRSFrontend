import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormBuilder } from '@angular/forms';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import jp from 'jsonpath';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DatePipe, formatDate } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';

/* GSRS Imports */
import { environment } from '../../../../environments/environment';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { LoadingService } from '@gsrs-core/loading';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SubstanceFormResults } from '@gsrs-core/substance-form/substance-form.model';

/* GSRS Impurities Imports */
import { ImpuritiesService } from '../service/impurities.service';
import { Impurities, ImpuritiesSubstance, ImpuritiesTesting, ImpuritiesSolution, ImpuritiesSolutionTable, ImpuritiesDetails, 
  ImpuritiesUnspecified, ImpuritiesTotal, SubRelationship, ValidationMessage } from '../model/impurities.model';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedDocument {
  fileName: string;
  totalPages: number;
  pages: ExtractedPage[];
  fullText: string;
}

@Component({
  selector: 'app-impurities-import',
  templateUrl: './impurities-import.component.html',
  styleUrl: './impurities-import.component.scss',
  standalone: false
})

export class ImpuritiesImportComponent implements OnInit, OnDestroy {

  isLoading = true;
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage> = [];
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  searchValue: string;
  errorMessage: string;
  subName = 'Substance Name *';
  impurities: Impurities;
  substanceId = null;
  id?: number;
  isDisableData = false;
  username = null;
  title = null;
  submitDateMessage = '';
  statusDateMessage = '';
  canEdit: boolean = false;
  subRelationship: Array<SubRelationship> = [];
  substanceName: string;
  substanceNameHintMessage = '';
  panelExpanded = true;
  downloadJsonHref: any;
  jsonFileName: string;
  dateTypeDate: Date;

  showAdvancedSettings = false;
  showTotalImpurities = false;
  configSettingsDisplay = {};

  /* Impurities Import Variables */
  jsonResult: any = null;

  constructor(
    private impuritiesService: ImpuritiesService,
    private configService: ConfigService,
    private substanceService: SubstanceService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private cvService: ControlledVocabularyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private titleService: Title,
    private sanitizer: DomSanitizer) { }

  async ngOnInit() {

    pdfjsLib.GlobalWorkerOptions.workerSrc = `${environment.baseHref || ""}assets/js/pdf.worker.min.mjs`;

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  async onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    //const pages = await this.extractTextFromFile(file);

    //const jsonResult = this.mapToImpuritiesModel(pages);

    // this.jsonResult = JSON.stringify(this.mapToJson(pages), null, 2);
    //console.log('Extracted JSON:', this.jsonResult);

    // Load on Register Impurities Form
    // this.loadOnForm();
  }

  /*
  async extractTextFromFile(file: File): Promise<ExtractedDocument> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pages: ExtractedPage[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      pages.push({ pageNumber: i, text: pageText });
    } //for

    const fullText = pages.map(p => p.text).join('\n');

    return {
      fileName: file.name,
      totalPages: pdf.numPages,
      pages,
      fullText
    };

  }
  */

  /*
  mapToJson(pages: string[]): any {
    const fullText = pages.join(' ');

    return {
      createdBy: 'ADMIN',
      modifiedBy: 'ADMIN',
      creationDate: Date.now(),
      lastModifiedDate: Date.now(),
      internalVersion: 1,
      sourceType: 'MONOGRAPH',
      source: 'USP',
      sourceId: this.extractSubstanceName(fullText),
      type: 'DRUG SUBSTANCE',
      specType: 'Accepted',
      productSubstanceName: this.extractSubstanceName(fullText),
      submitterName: 'USP',
      productId: this.extractSubstanceName(fullText),
      impuritiesSubstanceList: [
        {
          low: this.extractAssayLow(fullText),
          high: this.extractAssayHigh(fullText),
          unit: '%',
          impuritiesTestList: [
            this.mapAssayTest(fullText),
            this.mapOrganicImpuritiesTest(fullText)
          ],
          impuritiesResidualSolventsTestList: [
            this.mapResidualSolvents(fullText)
          ],
          impuritiesInorganicTestList: []
        }
      ],
      impuritiesTotal: {
        limitValue: this.extractTotalImpuritiesLimit(fullText),
        limitType: 'NMT'
      }
    };
  }

  private extractSubstanceName(text: string): string {
    const match = text.match(/^(\w+)/);
    return match ? match[1] : 'Unknown';
  }

  private extractAssayLow(text: string): number {
    const match = text.match(/NLT\s+([\d.]+)%/i);
    return match ? parseFloat(match[1]) : 98;
  }

  private extractAssayHigh(text: string): number {
    const match = text.match(/NMT\s+([\d.]+)%.*omeprazole/i);
    return match ? parseFloat(match[1]) : 102;
  }

  private extractTotalImpuritiesLimit(text: string): string {
    const match = text.match(/Total impurities.*?([\d.]+)%/i);
    return match ? match[1] : '1.0';
  }
  */

  /*
  private mapAssayTest(text: string): any {
    return {
      test: 'ASSAY',
      testType: 'HPLC/UV',
      source: 'USP',
      sourceId: 'OMEPRAZOLE',
      mode: 'LC',
      detectionType: 'UV',
      detectorWavelength: this.extractPattern(text, /Detector.*?UV\s+([\d]+\s*nm)/i) || '280 nm',
      columnSize: this.extractPattern(text, /Column:\s*([\d.\-mm x cm]+)/i) || '4.6-mm × 15-cm',
      columnPackingSize: '5-µm packing',
      columnPackingType: 'L7',
      flowRate: this.extractPattern(text, /Flow rate:\s*([\d.]+\s*mL\/min)/i) || '0.8 mL/min',
      injectionVolumeAmount: this.extractPattern(text, /Injection volume:\s*([\d]+\s*[µu]L)/i) || '20 µL',
      elutionType: 'ISOCRATIC',
      buffer: this.extractPattern(text, /Buffer:\s*([^.]+\.)/i),
      diluent: 'Acetonitrile and 0.01 M sodium borate (1:3)',
      standardSolution: this.extractPattern(text, /Standard solution:\s*([^[]+)/i),
      sampleSolution: this.extractPattern(text, /Sample solution:\s*([^[]+)/i),
      systemSuitabilitySolution: this.extractPattern(text, /System suitability solution:\s*([^[]+)/i),
      suitabilityReqRelStandardDeviation: 'NMT 1.0%',
      systemSuitabilityReqTailingFactor: 'NMT 1.5',
      impuritiesSolutionList: [],
      impuritiesDetailsList: [],
      impuritiesUnspecifiedList: [],
      impuritiesAnalysisList: [
        {
          samples: 'Standard solution and Sample solution',
          description: 'Calculate the percentage of omeprazole in the portion of Omeprazole taken:',
          resultFormula: 'Result = (ru/rs) × (Cs/Cu) × 100',
          formulaRU: 'peak response from the Sample solution',
          formulaRS: 'peak response from the Standard solution',
          formulaCS: 'concentration of USP Omeprazole RS in the Standard solution (mg/mL)',
          formulaCU: 'concentration of Omeprazole in the Sample solution (mg/mL)'
        }
      ]
    };
  }

  private mapOrganicImpuritiesTest(text: string): any {
    return {
      test: 'INORGANIC IMPURITIES',
      testType: 'HPLC/UV',
      source: 'USP',
      sourceId: 'OMEPRAZOLE',
      mode: 'LC',
      detectionType: 'UV',
      detectorWavelength: '264 nm',
      columnSize: '4.6-mm × 25-cm',
      columnPackingSize: '5-µm packing',
      columnPackingType: 'L7',
      flowRate: '0.8 mL/min',
      injectionVolumeAmount: '40 µL',
      autosamplerTemperature: '4°',
      elutionType: 'Gradient',
      diluent: 'Solution A and Solution B (3:1)',
      impuritiesSolutionList: [],
      impuritiesSolutionTableList: this.extractGradientTable(text),
      impuritiesDetailsList: this.extractImpurityDetails(text),
      impuritiesUnspecifiedList: [
        {
          impurityType: 'UNSPECIFIED IMPURITY',
          limitValue: '0.10',
          limitType: 'NMT',
          unit: '% Peak area'
        }
      ],
      impuritiesAnalysisList: [
        {
          samples: 'Standard solution and Sample solution',
          description: 'Calculate the percentage of any individual impurity in the portion of Omeprazole taken:',
          resultFormula: 'Result = (ru/rs) × (Cs/Cu) × (1/F) × 100',
          formulaRU: 'peak response of each impurity from the Sample solution',
          formulaRS: 'peak response of omeprazole from the Standard solution',
          formulaCS: 'concentration of USP Omeprazole RS in the Standard solution (mg/mL)',
          formulaCU: 'concentration of Omeprazole in the Sample solution (mg/mL)',
          formulaF: 'relative response factor'
        }
      ]
    };
  }
  */

  /*
  private extractGradientTable(text: string): any[] {
    // Matches the gradient table rows: time, Solution A%, Solution B%
    const rows = [
      { solutionTime: 0,    solutionAPercent: 75, solutionBPercent: 25 },
      { solutionTime: 12,   solutionAPercent: 75, solutionBPercent: 25 },
      { solutionTime: 22,   solutionAPercent: 50, solutionBPercent: 50 },
      { solutionTime: 45,   solutionAPercent: 50, solutionBPercent: 50 },
      { solutionTime: 45.1, solutionAPercent: 75, solutionBPercent: 25 },
    ];
    // For a more dynamic approach, parse Table 1 from 'text' using regex
    return rows;
  }

  private extractImpurityDetails(text: string): any[] {
    // Table 2 from the PDF — map each row
    const impurities = [
      { name: '5-Methoxy-1H-benzimidazol-2-thiol',          rrt: '0.41', rrf: '1.0',  limit: '0.15' },
      { name: 'Omeprazole related compound E',               rrt: '0.53', rrf: '1.34', limit: '0.15' },
      { name: 'OMEPRAZOLE RELATED COMPOUND I',               rrt: '0.58', rrf: '1.48', limit: '0.15' },
      { name: 'Desmethoxy omeprazole',                       rrt: '0.97', rrf: '1.0',  limit: '0.15' },
      { name: 'Omeprazole related compound A',               rrt: '1.07', rrf: '1.0',  limit: '0.15' },
      { name: 'Omeprazole 4-chloro analog',                  rrt: '1.16', rrf: '1.0',  limit: '0.15' },
      { name: 'Ufiprazole',                                  rrt: '1.25', rrf: '1.0',  limit: '0.15' },
      { name: 'Omeprazole related compounds F',              rrt: '1.55', rrf: null,   limit: null   },
      { name: 'Omeprazole related compounds G',              rrt: '1.64', rrf: null,   limit: null   },
    ];
  */
  /*
  return impurities.map(imp => ({
    impurityType: 'SPECIFIED IMPURITY',
    sourceImpurityName: imp.name,
    limitValue: imp.limit,
    limitType: 'NMT',
    unit: '% Peak area',
    identityCriteriaList: [
      imp.rrt ? { identityCriteriaType: 'RELATIVE RETENTION TIME',  amountValue: imp.rrt } : null,
      imp.rrf ? { identityCriteriaType: 'RELATIVE RESPONSE FACTOR', amountValue: imp.rrf } : null,
    ].filter(Boolean)
  }));
}

private mapResidualSolvents(text: string): any {
  return {
    impuritiesResidualSolventsList: [
      { limitValue: '0.1', limitType: 'NMT', unit: '%' }
    ]
  };
}

private extractPattern(text: string, regex: RegExp): string {
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}
*/

  /**NEW NEW NEW ********************************************************************************* */


  // ── Utility: extract value after a label ──────────────────────────────────
  
  /*
  extract(text: string, pattern: RegExp): string {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  } 

  
  // ── Detect source: USP or EP ───────────────────────────────────────────────
  private detectSource(text: string): { source: string; sourceType: string } {
    if (/USP[- ]NF|USP Monograph|uspnf\.com/i.test(text)) {
      return { source: 'USP', sourceType: 'MONOGRAPH' };
    }
    if (/European Pharmacopoeia|EUROPEAN PHARMACOPOEIA|0942/i.test(text)) {
      return { source: 'EP', sourceType: 'MONOGRAPH' };
    }
    return { source: '', sourceType: 'MONOGRAPH' };
  }

  // ── Detect substance name ─────────────────────────────────────────────────
  private detectSubstanceName(text: string): string {
    // Try to match monograph title (first prominent word after header noise)
    const patterns = [
      /^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s*\n/m,
      /Omeprazole/i,
      /OMEPRAZOLE/
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return m[0].trim().replace(/\n/g, ' ');
    }
    return '';
  }

  // ── Map assay / chromatographic test block ────────────────────────────────
  private mapChromatographicTest(
    text: string,
    testName: string,
    source: string,
    sourceId: string,
    sourceType: string
  ): ImpuritiesTest {
    const now = Date.now();

    // Elution type
    const isGradient = /gradient/i.test(text);
    const elutionType = isGradient ? 'Gradient' : 'ISOCRATIC';

    // Detection
    const wavelengthMatch = text.match(/UV\s*(\d{3})\s*nm/i);
    const detectorWavelength = wavelengthMatch
      ? `${wavelengthMatch[1]} nm`
      : '';

    // Column
    const columnMatch = text.match(
      /(\d+\.?\d*[-–]\s*mm\s*[×x]\s*\d+[-–]\s*cm)/i
    );
    const columnSize = columnMatch ? columnMatch[1].replace(/\s/g, '') : '';

    const packingSizeMatch = text.match(/(\d+[-–]?µm)\s*packing/i);
    const columnPackingSize = packingSizeMatch
      ? `${packingSizeMatch[1]} packing`
      : '';

    const packingTypeMatch = text.match(/packing\s+(L\d+)/i);
    const columnPackingType = packingTypeMatch ? packingTypeMatch[1] : '';

    // Flow rate
    const flowMatch = text.match(/([\d.]+\s*mL\/min)/i);
    const flowRate = flowMatch ? flowMatch[1] : '';

    // Injection volume
    const injMatch = text.match(/([\d.]+\s*[µu]L)/i);
    const injectionVolumeAmount = injMatch ? injMatch[1] : '';

    // Autosampler temperature
    const tempMatch = text.match(/[Aa]utosampler\s+temperature[:\s]*([\d°\s]+)/i);
    const autosamplerTemperature = tempMatch ? tempMatch[1].trim() : undefined;

    // Solutions
    const diluentMatch = text.match(/[Dd]iluent[:\s]+([^\n.]+)/);
    const diluent = diluentMatch ? diluentMatch[1].trim() : '';

    const stdMatch = text.match(/[Ss]tandard\s+solution[:\s]+([^\n.]+)/);
    const standardSolution = stdMatch ? '\n' + stdMatch[1].trim() : '';

    const sysMatch = text.match(
      /[Ss]ystem\s+suitability\s+solution[:\s]+([^\n.]+)/
    );
    const systemSuitabilitySolution = sysMatch ? sysMatch[1].trim() : '';

    const sampleMatch = text.match(/[Ss]ample\s+solution[:\s]+([^\n.]+)/);
    const sampleSolution = sampleMatch ? sampleMatch[1].trim() : '';

    const sensMatch = text.match(/[Ss]ensitivity\s+solution[:\s]+([^\n.]+)/);
    const sensitivitySolution = sensMatch ? sensMatch[1].trim() : undefined;

    // System suitability
    const suitSampleMatch = text.match(
      /[Ss]ample[:\s]+(System suitability solution[^\n]*)/
    );
    const systemSuitabilitySample = suitSampleMatch
      ? suitSampleMatch[1].trim()
      : '';

    const tailingMatch = text.match(
      /[Tt]ailing\s+factor[:\s]+(NMT\s+[\d.]+)/i
    );
    const systemSuitabilityReqTailingFactor = tailingMatch
      ? tailingMatch[1]
      : undefined;

    const rsdMatch = text.match(
      /[Rr]elative\s+standard\s+deviation[:\s]+(NMT\s+[\d.]+%)/i
    );
    const suitabilityReqRelStandardDeviation = rsdMatch
      ? rsdMatch[1]
      : undefined;

    const resolutionMatch = text.match(
      /[Rr]esolution[:\s]+(NLT\s+[\d.]+[^\n]*)/i
    );
    const suitabilityReqResolution = resolutionMatch
      ? resolutionMatch[1].trim()
      : undefined;

    const snrMatch = text.match(
      /[Ss]ignal[-\s]to[-\s]noise\s+ratio[:\s]+(NLT\s+[\d.]+[^\n]*)/i
    );
    const systemSuitabilitySignalToNoiseRatio = snrMatch
      ? snrMatch[1].trim()
      : undefined;

    // Solutions list
    const impuritiesSolutionList: ImpuritiesSolution[] = this.extractSolutions(
      text,
      now
    );

    // Gradient table
    const impuritiesSolutionTableList: ImpuritiesSolutionTable[] = isGradient
      ? this.extractGradientTable(text, now)
      : [];

    // Analysis block
    const impuritiesAnalysisList: ImpuritiesAnalysis[] = this.extractAnalysis(
      text,
      now
    );

    // Impurity details
    const impuritiesDetailsList: ImpurityDetail[] = this.extractImpurityDetails(
      text,
      now
    );

    // Unspecified impurities
    const impuritiesUnspecifiedList: ImpurityUnspecified[] =
      this.extractUnspecified(text, now);

    // Determine test type label
    const testType =
      wavelengthMatch ? `HPLC/UV` : 'CHROMATOGRAPHIC';

    return {
      createdBy: 'SYSTEM',
      modifiedBy: 'SYSTEM',
      creationDate: now,
      lastModifiedDate: now,
      internalVersion: 0,
      test: testName,
      testType,
      sourceType,
      source,
      sourceId,
      elutionType,
      system: 'Chromatographic',
      mode: 'LC',
      detectionType: 'UV',
      detectorWavelength,
      columnSize,
      columnPackingSize,
      columnPackingType,
      flowRate,
      injectionVolumeAmount,
      ...(autosamplerTemperature ? { autosamplerTemperature } : {}),
      diluent,
      systemSuitabilitySolution,
      standardSolution,
      sampleSolution,
      ...(sensitivitySolution ? { sensitivitySolution } : {}),
      systemSuitabilitySample,
      ...(suitabilityReqRelStandardDeviation
        ? { suitabilityReqRelStandardDeviation }
        : {}),
      ...(systemSuitabilityReqTailingFactor
        ? { systemSuitabilityReqTailingFactor }
        : {}),
      ...(suitabilityReqResolution ? { suitabilityReqResolution } : {}),
      ...(systemSuitabilitySignalToNoiseRatio
        ? { systemSuitabilitySignalToNoiseRatio }
        : {}),
      impuritiesElutionSolventList: [],
      impuritiesSolutionList,
      impuritiesSolutionTableList,
      impuritiesAnalysisList,
      impuritiesDetailsList,
      impuritiesUnspecifiedList
    };
  }

  // ── Extract named solutions (Solution A, B, etc.) ─────────────────────────
  private extractSolutions(text: string, now: number): SolutionItem[] {
    const solutions: SolutionItem[] = [];
    const pattern = /Solution\s+([A-Z])[:\s]+([^\n]{10,})/gi;
    let match;
    let id = 90;
    while ((match = pattern.exec(text)) !== null) {
      solutions.push({
        createdBy: 'SYSTEM',
        modifiedBy: 'SYSTEM',
        creationDate: now,
        lastModifiedDate: now,
        internalVersion: 0,
        id: id++,
        solutionLetter: match[1],
        solutionDescription: match[2].trim()
      });
    }
    return solutions;
  }

  // ── Extract gradient table rows ───────────────────────────────────────────
  private extractGradientTable(
    text: string,
    now: number
  ): SolutionTableItem[] {
    const rows: SolutionTableItem[] = [];
    // Match lines like: 0   75   25
    const pattern = /(\d+\.?\d*)\s+(\d+)\s+(\d+)/g;
    let match;
    let id = 55;
    while ((match = pattern.exec(text)) !== null) {
      const time = parseFloat(match[1]);
      const a = parseInt(match[2]);
      const b = parseInt(match[3]);
      // Simple guard: A+B should sum to 100
      if (a + b === 100 && time <= 200) {
        rows.push({
          createdBy: 'SYSTEM',
          modifiedBy: 'SYSTEM',
          creationDate: now,
          lastModifiedDate: now,
          internalVersion: 0,
          id: id++,
          solutionTime: time,
          solutionAPercent: a,
          solutionBPercent: b
        });
      }
    }
    return rows;
  }

  // ── Extract analysis block ─────────────────────────────────────────────────
  private extractAnalysis(text: string, now: number): AnalysisItem[] {
    const analyses: AnalysisItem[] = [];
    const samplesMatch = text.match(
      /[Ss]amples?[:\s]+(Standard solution[^\n]+)/
    );
    const formulaMatch = text.match(/Result\s*=\s*([^\n]+)/);
    const ruMatch = text.match(/r[Uu]\s*=\s*([^\n]+)/);
    const rsMatch = text.match(/r[Ss]\s*=\s*([^\n]+)/);
    const csMatch = text.match(/[Cc][Ss]\s*=\s*([^\n]+)/);
    const cuMatch = text.match(/[Cc][Uu]\s*=\s*([^\n]+)/);
    const fMatch = text.match(/F\s*=\s*([^\n]+)/);
    const descMatch = text.match(/[Cc]alculate\s+the\s+([^\n]+)/);

    if (formulaMatch) {
      analyses.push({
        createdBy: 'SYSTEM',
        modifiedBy: 'SYSTEM',
        creationDate: now,
        lastModifiedDate: now,
        internalVersion: 0,
        id: 1,
        samples: samplesMatch ? samplesMatch[1].trim() : '',
        description: descMatch ? 'Calculate the ' + descMatch[1].trim() : '',
        resultFormula: formulaMatch ? 'Result = ' + formulaMatch[1].trim() : '',
        formulaRU: ruMatch ? ruMatch[1].trim() : '',
        formulaRS: rsMatch ? rsMatch[1].trim() : '',
        formulaCS: csMatch ? csMatch[1].trim() : '',
        formulaCU: cuMatch ? cuMatch[1].trim() : '',
        ...(fMatch ? { formulaF: fMatch[1].trim() } : {})
      });
    }

    return analyses;
  }
  */

  /*
  // ── Extract specified impurity rows from the table ────────────────────────
  private extractImpurityDetails(
    text: string,
    now: number
  ): ImpuritiesDetails[] {
    const details: ImpuritiesDetails[] = [];
    // Match lines: Name   RRT   RRF   Limit
    // Pattern: word(s) followed by decimal numbers
    const rowPattern =
      /([A-Z][A-Za-z0-9\s\-()]+?)\s+(0\.\d+|1\.\d+)\s+([\d.]+)\s+([\d.]+)/g;
    let match;
    let id = 270;
  
    while ((match = rowPattern.exec(text)) !== null) {
      const name = match[1].trim();
      const rrt  = match[2];
      const rrf  = match[3];
      const limit = match[4];
  
      if (name.length < 5 || name.length > 80) continue;
  
      const identityCriteriaList: IdentityCriteria[] = [
        {
          createdBy: 'SYSTEM',
          modifiedBy: 'SYSTEM',
          creationDate: now,
          lastModifiedDate: now,
          internalVersion: 0,
          id: id * 2,
          identityCriteriaType: 'RELATIVE RESPONSE FACTOR',
          amountValue: rrf
        },
        {
          createdBy: 'SYSTEM',
          modifiedBy: 'SYSTEM',
          creationDate: now,
          lastModifiedDate: now,
          internalVersion: 0,
          id: id * 2 + 1,
          identityCriteriaType: 'RELATIVE RETENTION TIME',
          amountValue: rrt
        }
      ];
  
      details.push({
        createdBy: 'SYSTEM',
        modifiedBy: 'SYSTEM',
        creationDate: now,
        lastModifiedDate: now,
        internalVersion: 0,
        id: id++,
        impurityType: 'SPECIFIED IMPURITY',
        sourceImpurityName: name,
        limitValue: limit,
        limitType: 'NMT',
        unit: '% Peak area',
        identityCriteriaList
      });
    }
  
    return details;
  }
  
  // ── Extract unspecified impurity limits ───────────────────────────────────
  private extractUnspecified(
    text: string,
    now: number
  ): ImpurityUnspecified[] {
    const unspecified: ImpurityUnspecified[] = [];
    const match = text.match(
      /[Aa]ny\s+other\s+individual\s+impurity[^\d]*([\d.]+)%?/
    );
    if (match) {
      unspecified.push({
        createdBy: 'SYSTEM',
        modifiedBy: 'SYSTEM',
        creationDate: now,
        lastModifiedDate: now,
        internalVersion: 0,
        id: 40,
        impurityType: 'UNSPECIFIED IMPURITY',
        limitValue: match[1],
        limitType: 'NMT',
        unit: '% Peak area',
        identityCriteriaList: []
      });
    }
    return unspecified;
  }
  
  // ── Extract total impurities limit ────────────────────────────────────────
  private extractTotal(text: string, now: number) {
    const match = text.match(/[Tt]otal\s+impurit(?:y|ies)[^\d]*([\d.]+)/);
    if (match) {
      return {
        createdBy: 'SYSTEM',
        modifiedBy: 'SYSTEM',
        creationDate: now,
        lastModifiedDate: now,
        internalVersion: 0,
        id: 100,
        limitValue: match[1],
        limitType: 'NMT'
      };
    }
    return undefined;
  }


  // ── Detect if a section is assay or impurities ───────────────────────────
  splitSections(
    fullText: string
  ): { assayText: string; impuritiesText: string } {
    const assayIdx = fullText.search(/\bASSAY\b/i);
    const impuritiesIdx = fullText.search(/\bIMPURITIES\b|\bORGANIC IMPURITIES\b|\bRELATED SUBSTANCES\b/i);

    const assayText =
      assayIdx > -1
        ? fullText.slice(
          assayIdx,
          impuritiesIdx > assayIdx ? impuritiesIdx : fullText.length
        )
        : '';

    const impuritiesText =
      impuritiesIdx > -1 ? fullText.slice(impuritiesIdx) : '';

    return { assayText, impuritiesText };
  }

  */

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
  // ── Main mapping entry point ──────────────────────────────────────────────

  /*
  mapToImpuritiesModel(doc: ExtractedDocument): Impurities {
    const now = Date.now();
    const { source, sourceType } = this.detectSource(doc.fullText);
    const substanceName = this.detectSubstanceName(doc.fullText);
    const sourceId = substanceName.toUpperCase().split(' ')[0] || '';

    const { assayText, impuritiesText } = this.splitSections(doc.fullText);

    const tests: ImpuritiesTest[] = [];

    // Map Assay test if chromatographic
    if (assayText && /LC|HPLC|UV\s+\d{3}/i.test(assayText)) {
      tests.push(
        this.mapChromatographicTest(
          assayText,
          'ASSAY',
          source,
          sourceId,
          sourceType
        )
      );
    }

    // Map Organic Impurities / Related Substances test
    if (impuritiesText && /LC|HPLC|UV\s+\d{3}/i.test(impuritiesText)) {
      const testLabel = /ORGANIC IMPURITIES/i.test(impuritiesText)
        ? 'ORGANIC IMPURITIES'
        : /RELATED SUBSTANCES/i.test(impuritiesText)
          ? 'RELATED SUBSTANCES'
          : 'INORGANIC IMPURITIES';

      tests.push(
        this.mapChromatographicTest(
          impuritiesText,
          testLabel,
          source,
          sourceId,
          sourceType
        )
      );
    }

    // const impuritiesTotal = this.extractTotal(doc.fullText, now);

    const substance: ImpuritiesSubstance = {
      substanceUuid: '',
      approvalID: '',
      low: null,
      high: null,
      unit: '',
      impuritiesTestList: tests
    };

    return {
      sourceType,
      source,
      sourceId,
      type: '',
      specType: '',
      productSubstanceName: substanceName,
      submitterName: '',
      productId: '',
      impuritiesSubstanceList: [substance],
      ...(impuritiesTotal ? { impuritiesTotal } : {}),
      _self: ''
    };
  }
  */ 

  /******************************************************************************************* */

  downloadJson() {
    const blob = new Blob([JSON.stringify(this.jsonResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'impurities_output.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  loadOnForm() {
    this.router.navigateByUrl('/impurities?action=import', { state: { record: this.jsonResult } });
  }
  
}