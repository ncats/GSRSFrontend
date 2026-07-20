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
import { firstValueFrom } from 'rxjs';
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
import { GeneralService } from '../../service/general.service';

/* GSRS Impurities Imports */
import { ImpuritiesService } from '../service/impurities.service';
import {
  Impurities, ImpuritiesSubstance, ImpuritiesTesting, ImpuritiesSolution, ImpuritiesSolutionTable,
  ImpuritiesDetails, ImpuritiesAnalysis, ImpuritiesUnspecified, IdentityCriteria, ImpuritiesResidualSolventsTest,
  ImpuritiesInorganicTest, ImpuritiesInorganic, ImpuritiesTotal, SubRelationship, ValidationMessage
} from '../model/impurities.model';

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

  /* Impurities Import Variables */
  jsonResult: any = null;
  jsonResultText: string;

  substanceApprovalId: string;

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
  substanceUuid = null;
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

  constructor(
    private generalService: GeneralService,
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

    const extractedDoc = await this.extractTextFromFile(file);

    // Detect pharmacopoeia from raw PDF text and route to correct import function
    const pharmacopoeia = this.detectPharmacopoeia(extractedDoc.fullText);

    let impurities: Impurities | null = null;

    if (pharmacopoeia === 'USP') {
      impurities = await this.mapToImpuritiesModel(extractedDoc);

    } else if (pharmacopoeia === 'EP') {
      impurities = await this.epMapToImpuritiesModel(extractedDoc);

    } else {
      console.warn(
        'Could not determine pharmacopoeia from the PDF. ' +
        'Please ensure the file is a valid USP or EP monograph.'
      );
      return;  // stop here — do not load an empty form
    }

    if (!impurities) {
      console.error('Import returned no data.');
      return;
    }

    this.jsonResult = JSON.stringify(impurities);
    this.jsonResultText = JSON.stringify(this.jsonResult);

    // Load on Register Impurities Form or Details page
    this.loadOnForm();
  }

  private detectPharmacopoeia(text: string): 'USP' | 'EP' | 'UNKNOWN' {

    // Check EP first — more specific identifiers
    if (/EUROPEAN\s+PHARMACOPOEIA/i.test(text)) return 'EP';
    if (/Ph\.?\s*Eur\.?/i.test(text)) return 'EP';
    if (/\d{2}\/\d{4}:\d{4}/.test(text)) return 'EP'; // e.g. "07/2021:0942"

    // USP indicators
    if (/Document\s+Type:\s*USP\s+Monographs/i.test(text)) return 'USP';
    if (/USPC|uspnf\.com|USP-NF/i.test(text)) return 'USP';
    if (/Do\s+not\s+distribute/i.test(text)) return 'USP';

    return 'UNKNOWN';
  }

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

  // ---- Main mapping entry point ----------------------------------------------
  async mapToImpuritiesModel(extractedDoc: ExtractedDocument): Promise<Impurities> {
    let substanceUuid = '';
    let approvalID = '';
    const sourceId = '';

    // Heal the FULL text ONCE here 
    const substanceName = this.extractSubstanceName(extractedDoc.fullText);

    // Clean OCR pdf texts
    const cleanText = this.healOcrArtifacts(extractedDoc.fullText, substanceName);

    // Resolve substanceUuid BEFORE building the substance object 
    // returns an Observable.
    if (substanceName) {
      await this.getSubstanceNameDetails(substanceName);
    }

    // Slice sections ONCE here — pass into mapToTest() directly 
    const { assayText, impuritiesText } = this.splitSections(cleanText);

    const { source, sourceType } = this.extractSource(cleanText);
    const { dateType, dateTypeDate } = this.extractDateType(cleanText);
    const { assayLow, assayHigh, unit } = this.extractAssayLimits(cleanText);

    const impuritiesTestList: ImpuritiesTesting[] = [];

    const impuritiesResidualSolventsTestList: ImpuritiesResidualSolventsTest[] = [];

    const impuritiesTotal = this.extractTotal(extractedDoc.fullText);

    // ASSAY test
    if (assayText && /LC|HPLC|UV\s+\d{3}/i.test(assayText)) {
      impuritiesTestList.push(
        this.mapToTest(
          'ASSAY',
          assayText,      // section text
          assayText,      // assayText as fallback (same for assay)
          source,
          sourceId,
          sourceType
        )
      );
    }

    // ORGANIC IMPURITIES / RELATED SUBSTANCES test
    if (impuritiesText && /LC|HPLC|UV\s+\d{3}/i.test(impuritiesText)) {
      const testLabel = /ORGANIC IMPURITIES/i.test(impuritiesText)
        ? 'ORGANIC IMPURITIES'
        : /RELATED SUBSTANCES/i.test(impuritiesText)
          ? 'RELATED SUBSTANCES'
          : 'INORGANIC IMPURITIES';

      impuritiesTestList.push(
        this.mapToTest(
          testLabel,
          impuritiesText,  // impurities section text
          assayText,       // assayText for cross-reference resolution
          source,
          sourceId,
          sourceType
        )
      );
    }

    // INORGANIC IMPURITIES
    const impuritiesInorganicTestList: ImpuritiesInorganicTest[] =
      this.extractInorganicImpurities(
        extractedDoc.fullText,
        source,
        sourceType,
        sourceId
      );

    const substance: ImpuritiesSubstance = {
      substanceUuid: this.substanceUuid,
      approvalID: this.substanceApprovalId,
      low: assayLow,
      high: assayHigh,
      unit,
      impuritiesTestList,
      impuritiesResidualSolventsTestList,
      impuritiesInorganicTestList,
    };

    return {
      source,
      sourceType,
      sourceId,
      type: 'DRUG SUBSTANCE',
      specType: '',
      productId: this.substanceApprovalId,
      productSubstanceName: substanceName,
      submitterName: '',
      dateType,
      dateTypeDate,
      impuritiesSubstanceList: [substance],
      impuritiesTotal,
    };
  }

  // Detect if a section is assay or impurities
  splitSections(fullText: string): { assayText: string; impuritiesText: string } {
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

  private cleanOcrArtifacts(text: string): string {

    // Fix 1: Replace curly braces misread in place of parentheses
    //   "{1:3)"  →  "(1:3)"    "{3:1}"  →  "(3:1)"
    text = text.replace(/\{/g, '(').replace(/\}/g, ')');

    // Fix 2: Remove spaces around colon inside ratio parentheses
    //   "(1 :3)"  →  "(1:3)"    "(60 : 40)"  →  "(60:40)"
    text = text.replace(/\(\s*(\d+)\s*:\s*(\d+)\s*\)/g, '($1:$2)');

    // Fix 3: Triple ratios  e.g. "(10 : 10 : 80)"  →  "(10:10:80)"
    text = text.replace(/\(\s*(\d+)\s*:\s*(\d+)\s*:\s*(\d+)\s*\)/g, '($1:$2:$3)');

    // Fix 4: Collapse extra whitespace and newlines
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  private healOcrArtifacts(text: string, substanceName: string): string {

    // Pre-fix: Compound typo and curly braces
    text = text.replace(/\{/g, '(').replace(/\}/g, ')');
    text = text.replace(/Com[Pp]-?\s*ound/gi, 'Compound');

    // Fix 1: Heal garbled "USP <name> RS" zones
    text = text.replace(
      /\bUSP\s+[\w\s\d\-]+?[\s\-]*\bRS\b/gi,
      (zone: string) => {
        // Strip "USP " prefix and trailing "RS" (with any leading spaces/hyphens)
        let inner = zone
          .replace(/^USP\s+/i, '')
          .replace(/[\s\-]*\bRS\s*$/i, '')
          .trim();

        const relMatch = /\bRelated\b/i.exec(inner);

        if (relMatch) {
          // Related Compound zone
          // Fix substance name part (before "Related"), keep suffix intact
          const substancePart = inner.substring(0, relMatch.index).trim();
          const relatedSuffix = inner.substring(relMatch.index).trim();
          const collapsed = substancePart.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const target = substanceName.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const fixed = this.lcsSimilarity(collapsed, target) >= 0.65
            ? substanceName
            : substancePart;
          return `USP ${fixed} ${relatedSuffix} RS`;

        } else {
          // Main substance zone
          const collapsed = inner.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const target = substanceName.replace(/[^a-zA-Z]/g, '').toLowerCase();

          // Replace if collapsed form matches target — this catches BOTH:
          //   "Omew azole" → collapsed "omewazole" → score < 1.0 but >= 0.65 → replace
          //   "Ome Prazole" → collapsed "omeprazole" = target → score 1.0 → replace
          //   "Omeprazole"  → collapsed "omeprazole" = target → score 1.0 → replace
          // Note: we always replace when score >= 0.65 to normalise capitalisation too
          return this.lcsSimilarity(collapsed, target) >= 0.65
            ? `USP ${substanceName} RS`
            : zone;
        }
      }
    );

    // ── Fix 2: "[NorE" → "[Note"  and  "NorE" → "Note"
    text = text.replace(/\[NorE/g, '[Note');
    text = text.replace(/\bNorE\b/g, 'Note');

    // ── Fix 3: "lnject" → "Inject"
    text = text.replace(/\blnject/g, 'Inject');

    // ── Fix 4: "1 H-" → "1H-"  (digit + space + H + hyphen ONLY)
    // Targets chemical prefix spacing: "1 H-benzimidazol" → "1H-benzimidazol"
    // The \b before H prevents matching inside words
    text = text.replace(/(\d)\s+\b(H-)/g, '$1$2');

    // ── Fix 5: Spaces inside ratio parentheses
    text = text.replace(/\(\s*(\d+)\s*:\s*(\d+)\s*\)/g, '($1:$2)');
    text = text.replace(/\(\s*(\d+)\s*:\s*(\d+)\s*:\s*(\d+)\s*\)/g, '($1:$2:$3)');

    // ── Fix 6: OCR-truncated "Sensitivity solution:"
    text = text.replace(/(?<!\w)ion\s*:/g, 'Sensitivity solution:');

    // ── Fix 7: NLT / NMT normalization
    text = text.replace(/\bN[lL][tT]\b/g, 'NLT');
    text = text.replace(/\bN[mM][tT]\b/g, 'NMT');

    // ── Fix 8: Remove USP "effective date" annotations embedded by OCR ──────────
    // USP "Change to read" annotations appear as "(eff 1-Dec-2023)" or "(CN 1-May-2020)"
    // OCR often misreads "eff" as "ERR" producing "(ERR 1-Dec-2023)"
    // These appear inside variable descriptions and corrupt the extracted values.
    // e.g. "concentration of Amikacin Sulfate (ERR 1-Dec-2023) in the Sample solution"
    //   → "concentration of Amikacin Sulfate in the Sample solution"
    text = text.replace(
      /\(\s*(?:ERR|eff|CN|eff\.?)\s*[\d,\s\-A-Za-z]*\d{4}\s*\)/gi,
      ''
    );

    // ── Fix 9: Collapse spaced digits in molecular formula inside parentheses ───
    // "C 22 H 43 N 5 O 13" → "C22H43N5O13"
    // Only applies inside parentheses to avoid collapsing unrelated spaced numbers
    text = text.replace(/\(([^)]+)\)/g, (_, inner) =>
      '(' + inner.replace(/([A-Z])\s+(\d+)/g, '$1$2') + ')'
    );

    // ── Fix 10: Normalize analysis variable name capitalization ───────────────────
    // PDF.js collapses "R u" → "Ru" and "C s" → "Cs" but these must be
    // further normalized to lowercase "ru", "rs" and title-case "Cs", "Cu"
    // so they match the lookup keys used in detectAnalysisList().
    text = text.replace(/\bRu\b/g, 'ru');
    text = text.replace(/\bRs\b/g, 'rs');
    text = text.replace(/\bCu\b(?!\s*RS\b)/g, 'Cu');  // keep "Cu" as-is (already correct)
    text = text.replace(/\bCs\b/g, 'Cs');              // keep "Cs" as-is (already correct)

    // ── Fix 11: OCR digit-5 substituted for letter-s in variable names ─────────
    // "r5 =" → "rs ="    "C5 =" → "Cs ="
    // "(ru/r5)" → "(ru/rs)"    "C5/Cu" → "Cs/Cu"
    text = text.replace(/\br5\s*=/g, 'rs =');
    text = text.replace(/\bC5\s*=/g, 'Cs =');
    text = text.replace(/\/r5\s*\)/g, '/rs)');
    text = text.replace(/\bC5\s*\/\s*Cu/g, 'Cs/Cu');
    text = text.replace(/\bCs\s*\/\s*C5/g, 'Cs/Cu');

    // ── Fix 12: "HCI" → "HCl" (OCR misreads lowercase l as capital I) ────────────
    // Affects substance names like "Hydralazine Hydrochloride HCI"
    // and molecular formulas "C8H8N4·HCI"
    text = text.replace(/\bHCI\b/g, 'HCl');

    // ── Fix 13: Collapse whitespace
    return text.replace(/\s+/g, ' ').trim();
  }

  private lcsSimilarity(a: string, b: string): number {

    // Longest Common Subsequence similarity score
    // Returns a value between 0.0 (no match) and 1.0 (exact match)
    // Used to fuzzy-match garbled OCR substance names against the known correct name
    // e.g. "omeprazole" vs "omerazole" → high score → replace with correct name

    const m = a.length;
    const n = b.length;

    if (m === 0 || n === 0) return 0;

    // Build LCS dynamic programming table
    const dp: number[][] = Array.from(
      { length: m + 1 },
      () => new Array(n + 1).fill(0)
    );

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }

    // Normalize by the length of the longer string
    return dp[m][n] / Math.max(m, n);
  }

  // Detect source: USP or EP
  private extractSource(text: string): { source: string; sourceType: string } {

    // Extract the raw value of "Document Type:" from the PDF header.
    // PDF.js produces flat space-joined text, so we stop at the next known field label.
    const docTypeMatch = text.match(
      /Document\s+Type:\s*(.+?)(?=\s+(?:DOI:|Printed\s+from:|©|\d{4}\s+USPC|\d{4}\s+EDQM|Do\s+not\s+distribute)|$)/i
    );

    const rawDocType = docTypeMatch ? docTypeMatch[1].trim() : '';

    // Map the raw Document Type value to source + sourceType.
    // The raw value from the PDF is used as sourceType (normalized to uppercase).
    // The source (pharmacopoeia abbreviation) is derived from known keywords within it.

    // USP / USP-NF
    if (/USP/i.test(rawDocType)) {
      return {
        source: 'USP',
        sourceType: rawDocType.toUpperCase().includes('MONOGRAPH') ? 'MONOGRAPH' : rawDocType.toUpperCase()
      };
    }

    // European Pharmacopoeia (EP / Ph. Eur.) ---
    if (/European Pharmacopoeia|Ph\.?\s*Eur\.?|EDQM/i.test(rawDocType)) {
      return {
        source: 'EP',
        sourceType: rawDocType.toUpperCase().includes('MONOGRAPH') ? 'MONOGRAPH' : rawDocType.toUpperCase()
      };
    }

    // Fallback — if Document Type was not found, return empty source
    return {
      source: '',
      sourceType: rawDocType ? rawDocType.toUpperCase() : 'MONOGRAPH'
    };
  }

  private extractDateType(text: string): { dateType: string; dateTypeDate: string } {

    // The PDF header contains a field in this exact format (flat, space-joined by PDF.js):
    //   "Official Date: Official as of 01-May-2020"
    //   "Official Date: Official as of 01-Dec-2023"
    //
    // Group 1 → dateType     (e.g. "Official")
    // Group 2 → dateTypeDate (e.g. "01-May-2020")

    const match = text.match(
      /Official\s+Date:\s*([\w\s]+?)\s+as\s+of\s+(\d{2}-\w{3}-\d{4})/i
    );

    if (match) {
      return {
        dateType: match[1].trim(),
        dateTypeDate: this.formatDate(match[2].trim())  // e.g. "05/01/2020"
      };
    }

    // Fallback: looser date format (e.g. "01 May 2020")
    const looseDateMatch = text.match(
      /Official\s+Date:\s*([\w\s]+?)\s+as\s+of\s+([\d]{1,2}[\s\-\/]\w+[\s\-\/][\d]{4})/i
    );

    if (looseDateMatch) {
      return {
        dateType: looseDateMatch[1].trim(),
        dateTypeDate: this.formatDate(looseDateMatch[2].trim())
      };
    }

    return { dateType: '', dateTypeDate: '' };
  }

  private formatDate(rawDate: string): string {
    // Converts "DD-Mon-YYYY" or "DD Mon YYYY" → "MM/DD/YYYY"
    const monthMap: { [key: string]: string } = {
      jan: '01', feb: '02', mar: '03', apr: '04',
      may: '05', jun: '06', jul: '07', aug: '08',
      sep: '09', oct: '10', nov: '11', dec: '12'
    };

    const match = rawDate.match(/(\d{1,2})[\s\-\/](\w{3,})[\s\-\/](\d{4})/i);
    if (!match) return rawDate; // return as-is if format is unrecognized

    const day = match[1].padStart(2, '0');
    const month = monthMap[match[2].toLowerCase().substring(0, 3)] ?? '00';
    const year = match[3];

    return `${month}/${day}/${year}`;
  }

  private extractSubstanceName(text: string): string {

    // Strategy 1: "USP-NF <Name>" in the browser page title
    // Terminator: stop at "Printed" or end of meaningful title content
    const titleMatch = text.match(
      /USP-NF\s+([A-Z][A-Za-z0-9\s\-]+?)(?=\s+(?:Printed|©|\d{1,2}\/\d{1,2}\/\d{2,4}|$))/i
    );
    if (titleMatch) {
      const candidate = titleMatch[1].trim();
      if (candidate.length > 1 && candidate.length < 80) {
        return candidate;
      }
    }

    // Strategy 2: Zone between "Do not distribute" and "DEFINITION"
    const anchorIdx = text.toLowerCase().indexOf('do not distribute');
    const defIdx = text.toLowerCase().indexOf('definition');

    if (anchorIdx !== -1 && defIdx !== -1) {
      const zone = text.substring(anchorIdx + 'do not distribute'.length, defIdx);
      const tokens = zone.split(/\s+/);
      const nameTokens: string[] = [];

      const validToken = /^[A-Z][a-zA-Z]{1,}$/;
      const noisePattern = /^[+\-\d©]|[,\(\)\[\]\/\\°%*]|^[A-Z]{2,}\d|^C\d+H|^[a-z]{1,2}-/;

      for (const token of tokens) {
        if (nameTokens.length === 0 && !validToken.test(token)) continue;
        if (noisePattern.test(token)) break;
        if (!validToken.test(token)) break;

        // Stop at chemical formula abbreviations — all-caps tokens ≤ 3 chars
        // e.g. "HCI", "HCl", "NH", "ZN", "SN" that follow the substance name
        if (nameTokens.length >= 2 && token.length <= 3 && token === token.toUpperCase()) break;

        nameTokens.push(token);
      }

      if (nameTokens.length > 0) {
        return nameTokens.join(' ');
      }
    }

    // Strategy 3: Fallback — Title Case phrase before DEFINITION
    const beforeDef = defIdx !== -1 ? text.substring(0, defIdx) : text;
    const fallback = beforeDef.match(/\n([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,4})\n/);
    return fallback ? fallback[1].trim() : '';
  }

  // Map to Test Section
  private mapToTest(
    testLabel: string,
    sectionText: string,      // ← either assayText or impuritiesText
    assayText: string,        // ← always needed for cross-reference resolution
    source: string,
    sourceId: string,
    sourceType: string
  ): ImpuritiesTesting {

    const now = Date.now();

    // Solutions
    // Pass sectionText directly
    // Pass assayText as fallback for cross-reference resolution in impurities section
    const solutions = this.detectStandardSystemSolutions(sectionText, assayText);

    const standardSolution = solutions['standardSolution'];
    const systemSuitabilitySolution = solutions['systemSuitabilitySolution'];
    const sampleSolution = solutions['sampleSolution'];
    const sensitivitySolution = solutions['sensitivitySolution'];

    const buffer = this.detectBuffer(sectionText);
    const diluent = this.detectDiluent(sectionText, assayText);

    const systemSuitabilitySample = this.detectSystemSuitabilitySample(sectionText, testLabel);

    const suitability = this.detectSuitabilityRequirements(sectionText, testLabel);
    const suitabilityReqResolution = suitability['suitabilityReqResolution'];
    const systemSuitabilityReqTailingFactor = suitability['systemSuitabilityReqTailingFactor'];
    const suitabilityReqRelStandardDeviation = suitability['suitabilityReqRelStandardDeviation'];
    const systemSuitabilitySignalToNoiseRatio = suitability['systemSuitabilitySignalToNoiseRatio'];

    console.log('r5 still present?', /\br5\s*=/.test(sectionText));
    console.log('C5 still present?', /\bC5\s*=/.test(sectionText));

    const analysisData = this.detectAnalysisList(sectionText, testLabel);
    const impuritiesAnalysisList = [{
      samples: analysisData['samples'],
      description: analysisData['description'],
      resultFormula: analysisData['resultFormula'],
      formulaRU: analysisData['formulaRU'],
      formulaRS: analysisData['formulaRS'],
      formulaCS: analysisData['formulaCS'],
      formulaCU: analysisData['formulaCU'],
      ...(analysisData['formulaF'] ? { formulaF: analysisData['formulaF'] } : {}),
      ...(analysisData['formulaP'] ? { formulaP: analysisData['formulaP'] } : {}),
    }];

    // Chromatographic parameters
    const wavelengthMatch = sectionText.match(/UV\s*(\d{3})\s*nm/i);
    const detectorWavelength = wavelengthMatch ? `${wavelengthMatch[1]} nm` : '';

    const columnMatch = sectionText.match(/(\d+\.?\d*[-–]\s*mm\s*[×x]\s*\d+[-–]\s*cm)/i);
    const columnSize = columnMatch ? columnMatch[1].replace(/\s/g, '') : '';

    const packingSizeMatch = sectionText.match(/(\d+[-–]?µm)\s*packing/i);
    const columnPackingSize = packingSizeMatch ? `${packingSizeMatch[1]} packing` : '';

    const packingTypeMatch = sectionText.match(/packing\s+(L\d+)/i);
    const columnPackingType = packingTypeMatch ? packingTypeMatch[1] : '';

    const flowMatch = sectionText.match(/([\d.]+\s*mL\/min)/i);
    const flowRate = flowMatch ? flowMatch[1] : '';

    const injMatch = sectionText.match(/([\d.]+\s*[µu]L)/i);
    const injectionVolumeAmount = injMatch ? injMatch[1] : '';

    const tempMatch = sectionText.match(/[Aa]utosampler\s+temperature[:\s]*([\d°\s]+)/i);
    const autosamplerTemperature = tempMatch ? tempMatch[1].trim() : undefined;

    // Lists
    const impuritiesSolutionList = this.extractSolution(sectionText, now);

    // Solution table and elution type
    // Always call extractSolutionTable — no isGradient guard needed.
    // The function returns [] when no table exists (isocratic sections).
    // elutionType is derived from whether a table was found.
    const impuritiesSolutionTableList: ImpuritiesSolutionTable[] =
      this.extractSolutionTable(sectionText, now);

    const elutionType = impuritiesSolutionTableList.length > 0
      ? 'GRADIENT'
      : 'ISOCRATIC';

    const impuritiesDetailsList = this.extractImpurityDetails(sectionText, now);
    const impuritiesUnspecifiedList = this.extractUnspecified(sectionText, now);

    const testType = wavelengthMatch ? 'HPLC/UV' : 'CHROMATOGRAPHIC';

    return {
      test: testLabel,
      testType,
      sourceType,
      source,
      sourceId,
      buffer,
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
      ...(suitabilityReqRelStandardDeviation ? { suitabilityReqRelStandardDeviation } : {}),
      ...(systemSuitabilityReqTailingFactor ? { systemSuitabilityReqTailingFactor } : {}),
      ...(suitabilityReqResolution ? { suitabilityReqResolution } : {}),
      ...(systemSuitabilitySignalToNoiseRatio ? { systemSuitabilitySignalToNoiseRatio } : {}),
      impuritiesElutionSolventList: [],
      impuritiesSolutionList,
      impuritiesSolutionTableList,
      impuritiesAnalysisList,
      impuritiesDetailsList,
      impuritiesUnspecifiedList,
    };
  }

  private extractAssayLimits(text: string): { assayLow: number; assayHigh: number; unit: string } {

    // -------------------------------------------------------------------------
    // Strategy 1: Direct percentage range in Acceptance criteria
    //   e.g. "Acceptance criteria: 98.0%-102.0% on the dried basis"
    //   Covers: Omeprazole and most standard USP small molecule monographs
    // -------------------------------------------------------------------------
    const pctMatch = text.match(
      /Acceptance\s+criteria:\s*([\d.]+)\s*%\s*[-–]\s*([\d.]+)\s*%/i
    );
    if (pctMatch) {
      return {
        assayLow: parseFloat(pctMatch[1]),
        assayHigh: parseFloat(pctMatch[2]),
        unit: '%'
      };
    }

    // -------------------------------------------------------------------------
    // Strategy 2: NLT / NMT in the DEFINITION block with µg/mg or %
    //   e.g. "NLT 674 µg/mg and NMT 786 µg/mg of amikacin"
    //   e.g. "NLT 98.0% and NMT 102.0%"
    //   Covers: Amikacin Sulfate and potency-based monographs
    // -------------------------------------------------------------------------
    const nltNmtMatch = text.match(
      /NLT\s+([\d.]+)\s*(µg\/mg|ug\/mg|%)\s+and\s+NMT\s+([\d.]+)\s*(µg\/mg|ug\/mg|%)/i
    );
    if (nltNmtMatch) {
      return {
        assayLow: parseFloat(nltNmtMatch[1]),
        assayHigh: parseFloat(nltNmtMatch[3]),
        unit: this.normalizeUnit(nltNmtMatch[2])
      };
    }

    // -------------------------------------------------------------------------
    // Strategy 3: Numeric range in Acceptance criteria with a unit in parentheses
    //   e.g. "Acceptance criteria (µg/mg)* ... 674-786"
    //   Covers: Amikacin Sulfate Table 2 style acceptance criteria
    // -------------------------------------------------------------------------
    const tableMatch = text.match(
      /Acceptance\s+[Cc]riteria\s*\(\s*(µg\/mg|ug\/mg|%)\s*\)[^\d]*([\d.]+)\s*[-–]\s*([\d.]+)/i
    );
    if (tableMatch) {
      return {
        assayLow: parseFloat(tableMatch[2]),
        assayHigh: parseFloat(tableMatch[3]),
        unit: this.normalizeUnit(tableMatch[1])
      };
    }

    // -------------------------------------------------------------------------
    // Strategy 4: Plain numeric range in Acceptance criteria (no unit inline)
    //   e.g. "Acceptance criteria: 90.0-110.0"
    // -------------------------------------------------------------------------
    const plainRangeMatch = text.match(
      /Acceptance\s+criteria:\s*([\d.]+)\s*[-–]\s*([\d.]+)/i
    );
    if (plainRangeMatch) {
      return {
        assayLow: parseFloat(plainRangeMatch[1]),
        assayHigh: parseFloat(plainRangeMatch[2]),
        unit: '%'   // default unit when not stated
      };
    }

    return { assayLow: 0, assayHigh: 0, unit: '' };
  }

  private normalizeUnit(raw: string): string {
    // Normalize unit variants to a consistent display value
    const map: { [key: string]: string } = {
      'ug/mg': 'µg/mg',
      'µg/mg': 'µg/mg',
      '%': '%'
    };
    return map[raw.toLowerCase()] ?? raw;
  }

  private detectBuffer(text: string): string {

    const terminators =
      '(?=\\s*(?:' +
      'Mobile\\s+phase|' +
      'Diluent|' +
      'Standard\\s+solution|' +
      'Sample\\s+solution|' +
      'System\\s+suitability(?:\\s+solution)?|' +
      'Sensitivity\\s+solution|' +
      'Chromatographic\\s+system|' +
      'Mode|Detector|Column|' +
      'Flow\\s+rate|' +
      'Injection\\s+volume|' +
      'Autosampler|' +
      'IMPURITIES|IDENTIFICATION|' +
      'SPECIFIC\\s+TESTS|ADDITIONAL\\s+REQUIREMENTS' +
      ')\\s*:)';

    const bufferPattern = new RegExp(
      'Buffer:\\s*(.+?)' + terminators,
      'is'   // i = case-insensitive, s = dotAll (. matches newlines)
    );

    const match = text.match(bufferPattern);

    if (match) {
      return this.cleanOcrArtifacts(match[1]);
    }

    return '';
  }

  private detectDiluent(sectionText: string, assayText?: string): string {

    const terminators =
      '(?=\\s*(?:' +
      'Standard\\s+(?:stock\\s+)?solution|' +
      'Sample\\s+(?:stock\\s+)?solution|' +
      'System\\s+suitability(?:\\s+(?:stock\\s+)?solution)?|' +
      'Sensitivity\\s+solution|' +
      'Chromatographic\\s+system|' +
      'Extraction\\s+column|' +
      'Mobile\\s+phase|' +
      'Buffer|' +
      'Mode|Detector|Column|' +
      'Flow\\s+rate|' +
      'Injection\\s+volume|' +
      'Autosampler|' +
      'IMPURITIES|IDENTIFICATION|' +
      'SPECIFIC\\s+TESTS|ADDITIONAL\\s+REQUIREMENTS' +
      ')\\s*(?:[,:(]|\\s+(?:Mode|Detector|Column|Flow)))';  // ← fix: added ( and space+subfield

    const diluentPattern = new RegExp(
      'Diluent:\\s*(.+?)' + terminators,
      'is'
    );

    // Strategy 1: Cross-reference pattern
    // e.g. "Mobile phase, Diluent, and System suitability solution:
    //        Prepare as directed in the Assay."
    // Diluent is not re-declared — resolve from assayText instead
    const crossRefPattern = /(?:Mobile\s+phase\s*,\s*)?Diluent\s*,?\s*(?:and\s+[\w\s]+)?:\s*(?:Prepare|Proceed)\s+as\s+directed\s+in\s+(?:the\s+)?\w+/i;

    if (crossRefPattern.test(sectionText) && assayText) {
      const assayMatch = assayText.match(diluentPattern);
      if (assayMatch) {
        return this.cleanOcrArtifacts(assayMatch[1]);
      }
      return '';
    }

    // Strategy 2: Direct "Diluent:" declaration
    const match = sectionText.match(diluentPattern);
    if (match) {
      return this.cleanOcrArtifacts(match[1]);
    }

    return '';
  }

  private detectStandardSystemSolutions(sectionText: string, assayText?: string): { [key: string]: string } {

    // only needed for IMPURITIES cross-reference resolution
    // Define terminator labels
    const T: { [key: string]: string } = {
      sensitivity: `Sensitivity\\s+solution`,
      sample: `Sample\\s+(?:stock\\s+)?solution`,
      standard: `Standard\\s+(?:stock\\s+)?solution`,
      syssuit: `System\\s+suitability(?:\\s+(?:stock\\s+)?solution)?`,
      chrom: `Chromatographic\\s+system`,
      mobile: `Mobile\\s+phase`,
      buffer: `Buffer`,
      diluent: `Diluent`,
      mode: `Mode`,
      detector: `Detector`,
      column: `Column`,
      flowrate: `Flow\\s+rate`,
      injection: `Injection\\s+volume`,
      autosampler: `Autosampler`,
      impurities: `IMPURITIES`,
      specific: `SPECIFIC\\s+TESTS`,
      additional: `ADDITIONAL\\s+REQUIREMENTS`,
    };

    // Stops when a label is followed by ,  :  (  OR whitespace+Mode/Detector/Column/Flow
    const term = (...exclude: string[]): string => {
      const patterns = Object.entries(T)
        .filter(([k]) => !exclude.includes(k))
        .map(([, v]) => v);
      return `(?=\\s*(?:${patterns.join('|')})\\s*(?:[,:(]|\\s+(?:Mode|Detector|Column|Flow)))`;
    };

    // Extract a single field from the given text
    const getField = (text: string, anchor: string, terminator: string): string => {
      const pattern = new RegExp(`${anchor}:\\s*(.+?)${terminator}`, 'is');
      const match = text.match(pattern);
      return match ? match[1].replace(/\s+/g, ' ').trim() : '';
    };

    // Cross-reference pattern
    // e.g. "Prepare as directed in the Assay" / "Proceed as directed in the Assay"
    // When detected, resolve the value from assayText instead
    const crossRef = /^(?:Prepare|Proceed)\s+as\s+directed\s+in\s+(?:the\s+)?\w+/i;

    const resolve = (anchor: string, terminator: string): string => {
      let val = getField(sectionText, anchor, terminator);
      if (val && crossRef.test(val) && assayText) {
        val = getField(assayText, anchor, terminator);
      }
      return val;
    };

    // Extract and return all four solution fields
    return {
      standardSolution: resolve(`(?<![Ss]tock\\s)Standard\\s+solution`, term('standard')),
      systemSuitabilitySolution: resolve(`(?<![Ss]tock\\s)System\\s+suitability\\s+solution`, term('syssuit')),
      sampleSolution: resolve(`(?<![Ss]tock\\s)Sample\\s+solution`, term('sample')),
      sensitivitySolution: resolve(`Sensitivity\\s+solution`, term('sensitivity')),
    };
  }

  private detectSystemSuitabilitySample(fullText: string, test: string): string {

    // Slice the correct section using 'test' parameter
    const assayIdx = fullText.search(/\bASSAY\b/i);
    const impuritiesIdx = fullText.search(/\bIMPURITIES\b/i);
    const specificIdx = fullText.search(/\bSPECIFIC\s+TESTS\b/i);

    let sectionText = '';

    if (test.toUpperCase() === 'ASSAY') {
      const start = assayIdx !== -1 ? assayIdx : 0;
      const end = impuritiesIdx !== -1 ? impuritiesIdx : fullText.length;
      sectionText = fullText.substring(start, end);
    } else {
      const start = impuritiesIdx !== -1 ? impuritiesIdx : 0;
      const end = specificIdx !== -1 ? specificIdx : fullText.length;
      sectionText = fullText.substring(start, end);
    }

    // Extract "Sample(s):" from the System suitability section
    // Guard: negative lookahead excludes "System suitability solution/stock"
    //
    // Some PDFs (e.g. Amikacin) insert Table data and [Note...] between
    // "Samples:" and "Suitability requirements" — both are now stop labels.
    //
    // Examples:
    //   "System suitability"
    //   "Samples: System suitability solution and Standard solution"
    //   "Table 1 ..."                          ← Amikacin — now stopped here
    //   "[Note—relative retention times...]"   ← Amikacin/Hydralazine — now stopped here
    //   "Suitability requirements"

    const pattern = new RegExp(
      `System\\s+suitability` +   // section header
      `(?!\\s+(?:solution|stock))` +   // NOT "System suitability solution/stock"
      `\\s*Samples?\\s*:\\s*` +   // "Sample:" or "Samples:"
      `(.+?)` +   // captured value
      `(?=\\s*(?:` +   // stop at:
      `Suitability\\s+requirements|` +   // primary stop
      `Table\\s+\\d+|` +   // ← NEW: Table 1, Table 2, etc.
      `\\[Note|` +   // ← NEW: [Note—...]
      `Resolution|` +
      `Tailing\\s+factor|` +
      `Relative\\s+standard\\s+deviation|` +
      `Signal.to.noise|` +
      `Column\\s+efficiency|` +
      `Analysis` +
      `))`,
      'is'
    );

    const match = sectionText.match(pattern);
    return match ? match[1].replace(/\s+/g, ' ').trim() : '';
  }

  private detectSuitabilityRequirements(
    fullText: string,
    test: string
  ): { [key: string]: string } {

    // Slice the correct section using 'test' parameter
    const assayIdx = fullText.search(/\bASSAY\b/i);
    const impuritiesIdx = fullText.search(/\bIMPURITIES\b/i);
    const specificIdx = fullText.search(/\bSPECIFIC\s+TESTS\b/i);

    let sectionText = '';

    if (test.toUpperCase() === 'ASSAY') {
      const start = assayIdx !== -1 ? assayIdx : 0;
      const end = impuritiesIdx !== -1 ? impuritiesIdx : fullText.length;
      sectionText = fullText.substring(start, end);
    } else {
      const start = impuritiesIdx !== -1 ? impuritiesIdx : 0;
      const end = specificIdx !== -1 ? specificIdx : fullText.length;
      sectionText = fullText.substring(start, end);
    }

    // Isolate the "Suitability requirements" block
    // The block starts at "Suitability requirements" and ends at "Analysis"
    const blockPattern = /Suitability\s+requirements\s*(.+?)(?=\s*(?:Analysis\b|$))/is;
    const blockMatch = sectionText.match(blockPattern);

    // Return empty strings for all fields if block not found
    if (!blockMatch) {
      return {
        suitabilityReqResolution: '',
        systemSuitabilityReqTailingFactor: '',
        suitabilityReqRelStandardDeviation: '',
        systemSuitabilitySignalToNoiseRatio: '',
      };
    }

    const block = blockMatch[1];

    // Terminator — stops each field at the next known field label
    const fieldTerm = (
      `(?=\\s*(?:` +
      `Resolution|` +
      `Tailing\\s+factor|` +
      `Relative\\s+standard\\s+deviation|` +
      `Signal.to.noise\\s+ratio|` +
      `Column\\s+efficiency|` +
      `Analysis|` +
      `$` +
      `))`
    );

    // Extract each field from the block
    const getField = (anchor: string): string => {
      const pattern = new RegExp(`${anchor}\\s*:\\s*(.+?)${fieldTerm}`, 'is');
      const match = block.match(pattern);
      return match ? match[1].replace(/\s+/g, ' ').trim() : '';
    };

    return {
      // "Resolution: NLT 2.0 between omeprazole and omeprazole related compound A..."
      suitabilityReqResolution: getField(`Resolution`),

      // "Tailing factor: NMT 1.5"  or  "Tailing factor: NMT 2, Standard solution"
      systemSuitabilityReqTailingFactor: getField(`Tailing\\s+factor`),

      // "Relative standard deviation: NMT 1.0%"  or  "NMT 5%, Standard solution"
      suitabilityReqRelStandardDeviation: getField(`Relative\\s+standard\\s+deviation`),

      // "Signal-to-noise ratio: NLT 10, Sensitivity solution"
      systemSuitabilitySignalToNoiseRatio: getField(`Signal.to.noise\\s+ratio`),
    };
  }

  private detectAnalysisList(
    sectionText: string,   // ← already the correct section (assayText or impuritiesText)
    test: string
  ): { [key: string]: string } {

    // ── Step 1: Normalize OCR variable name variants on the section text ───────
    // Run here as a safety net in case any artifacts survived healOcrArtifacts()
    sectionText = sectionText.replace(/\br\s+u\b/gi, 'ru');
    sectionText = sectionText.replace(/\br\s+s\b/gi, 'rs');
    sectionText = sectionText.replace(/\bRu\b/g, 'ru');
    sectionText = sectionText.replace(/\bRs\b/g, 'rs');
    sectionText = sectionText.replace(/\bC\s+s\b/g, 'Cs');
    sectionText = sectionText.replace(/\bC\s+u\b/g, 'Cu');
    sectionText = sectionText.replace(/\br5\s*=/g, 'rs =');   // ← digit-5 fix
    sectionText = sectionText.replace(/\bC5\s*=/g, 'Cs =');   // ← digit-5 fix
    sectionText = sectionText.replace(/\/r5\s*\)/g, '/rs)');
    sectionText = sectionText.replace(/\(\s*ru\s*\/\s*rs\s*\)/gi, '(ru/rs)');
    sectionText = sectionText.replace(/\(\s*Cs\s*\/\s*Cu\s*\)/gi, '(Cs/Cu)');
    sectionText = sectionText.replace(/\(\s*(\d+)\s*:\s*(\d+)\s*\)/g, '($1:$2)');
    sectionText = sectionText.replace(
      /\(\s*(?:ERR|eff|CN|eff\.?)\s*[\d,\s\-A-Za-z]*\d{4}\s*\)/gi, ''
    );
    // Molecular formula spaces — loop until stable
    sectionText = sectionText.replace(/\(([^)]+)\)/g, (_, inner) => {
      let prev = '', curr = inner;
      while (prev !== curr) { prev = curr; curr = curr.replace(/([A-Z])\s+(\d+)/g, '$1$2'); }
      return '(' + curr + ')';
    });
    sectionText = sectionText.replace(/\s+/g, ' ').trim();

    // ── NO internal slicing — use sectionText directly ────────────────────────
    // The caller (mapToTest) already passes the correct section.
    // Previous version sliced internally which caused it to pull from
    // a different text boundary, bypassing healOcrArtifacts().

    // ── Step 2: Isolate the Analysis block ────────────────────────────────────
    const blockMatch = sectionText.match(
      /\bAnalysis\b\s*(.+?)(?=\s*(?:Acceptance\s+criteria|IMPURITIES|SPECIFIC\s+TESTS|ADDITIONAL\s+REQUIREMENTS|$))/is
    );

    const empty = {
      samples: '', description: '', resultFormula: '',
      formulaRU: '', formulaRS: '', formulaCS: '',
      formulaCU: '', formulaF: '', formulaP: '',
    };
    if (!blockMatch) return empty;

    let block = blockMatch[1];

    // Apply molecular formula fix to block too
    block = block.replace(/\(([^)]+)\)/g, (_, inner) => {
      let prev = '', curr = inner;
      while (prev !== curr) { prev = curr; curr = curr.replace(/([A-Z])\s+(\d+)/g, '$1$2'); }
      return '(' + curr + ')';
    });

    // ── Step 3: Samples ───────────────────────────────────────────────────────
    const samplesMatch = block.match(
      /\bSamples?\s*:\s*(.+?)(?=\s*(?:Calculate|Result\s*=|ru\s*=|rs\s*=|$))/is
    );
    const samples = samplesMatch ? samplesMatch[1].replace(/\s+/g, ' ').trim() : '';

    // ── Step 4: Description ───────────────────────────────────────────────────
    const descMatch = block.match(
      /(Calculate\s+.+?)(?=\s*(?:Result\s*=|ru\s*=|rs\s*=|Cs\s*=|Cu\s*=|[A-Z]\s*=|$))/is
    );
    const description = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : '';

    // ── Step 5: Result formula ────────────────────────────────────────────────
    const defaultFormulas: { [key: string]: string } = {
      'ASSAY': 'Result = (ru/rs) x (Cs/Cu) x 100',
      'IMPURITIES': 'Result = (ru/rs) x (Cs/Cu) x (1/F) x 100',
    };

    let resultFormula = '';
    const formulaMatch = block.match(
      /Result\s*=\s*(.+?)(?=\s*(?:ru\s*=|rs\s*=|Cs\s*=|Cu\s*=|[A-Z]\s*=|$))/is
    );
    if (formulaMatch) {
      const val = formulaMatch[1].replace(/\s+/g, ' ').trim();
      if (!val || /^[A-Za-z]{1,3}$/.test(val)) {
        const hasPotency = /\bP\s*=\s*potency\b/i.test(block);
        const hasConvFactor = /\bF\s*=\s*conversion\s+factor\b/i.test(block);
        resultFormula = (hasPotency && hasConvFactor)
          ? 'Result = (ru/rs) x (Cs/Cu) x P x F'
          : (defaultFormulas[test.toUpperCase()] ?? defaultFormulas['ASSAY']);
      } else {
        resultFormula = 'Result = ' + val;
      }
    } else {
      const hasPotency = /\bP\s*=\s*potency\b/i.test(block);
      const hasConvFactor = /\bF\s*=\s*conversion\s+factor\b/i.test(block);
      resultFormula = (hasPotency && hasConvFactor)
        ? 'Result = (ru/rs) x (Cs/Cu) x P x F'
        : (defaultFormulas[test.toUpperCase()] ?? defaultFormulas['ASSAY']);
    }
    resultFormula = resultFormula.replace(/\s+x\s+/g, ' x ');

    // ── Step 6: Formula variables — case-insensitive lookup ───────────────────
    const varPattern = /\b([A-Za-z][A-Za-z0-9]*)\s*=\s*(.+?)(?=\s*(?:[A-Za-z][A-Za-z0-9]*\s*=|Acceptance|$))/gis;
    const vars: { [key: string]: string } = {};

    let varMatch: RegExpExecArray | null;
    while ((varMatch = varPattern.exec(block)) !== null) {
      const key = varMatch[1].trim();
      const val = varMatch[2].replace(/\s+/g, ' ').trim();
      if (key.toLowerCase() !== 'result' && val.length > 2) {
        vars[key] = val;
      }
    }

    const getVar = (...keys: string[]): string => {
      for (const k of keys) {
        const found = Object.keys(vars).find(v => v.toLowerCase() === k.toLowerCase());
        if (found && vars[found]) return vars[found];
      }
      return '';
    };

    return {
      samples,
      description,
      resultFormula,
      formulaRU: getVar('ru'),
      formulaRS: getVar('rs'),
      formulaCS: getVar('Cs', 'cs'),
      formulaCU: getVar('Cu', 'cu'),
      formulaF: getVar('F'),
      formulaP: getVar('P'),
    };
  }

  // Extract named solutions (Solution A, B, etc.)
  private extractSolution(
    sectionText: string,
    now: number
  ): ImpuritiesSolution[] {

    const solutions: ImpuritiesSolution[] = [];

    // Find all "Solution X:" declarations (A through K)
    const solHeaderPattern = /\bSolution\s+([A-K])\s*:/gi;
    const solMatches: { letter: string; index: number; end: number }[] = [];

    let m: RegExpExecArray | null;
    while ((m = solHeaderPattern.exec(sectionText)) !== null) {
      solMatches.push({
        letter: m[1].toUpperCase(),
        index: m.index,
        end: m.index + m[0].length,
      });
    }

    if (solMatches.length > 0) {

      // For each "Solution X:", the description runs from after the colon
      // to the START of the next "Solution X:" (or the next major field label)
      for (let i = 0; i < solMatches.length; i++) {
        const descStart = solMatches[i].end;

        let descEnd: number;

        if (i + 1 < solMatches.length) {
          // Stop at the next Solution header
          descEnd = solMatches[i + 1].index;
        } else {
          // Last solution — stop at the next major field label
          const endMatch = /\b(?:Mobile\s+phase|Diluent|Standard\s+(?:stock\s+)?solution|Sample\s+(?:stock\s+)?solution|System\s+suitability|Sensitivity\s+solution|Chromatographic\s+system|Mode\s*:|Detector\s*:|Column\s*:|Flow\s+rate|Injection\s+volume|Autosampler|IMPURITIES|SPECIFIC\s+TESTS|ADDITIONAL\s+REQUIREMENTS)\s*[:(]/i
            .exec(sectionText.substring(descStart));
          descEnd = endMatch
            ? descStart + endMatch.index
            : sectionText.length;
        }

        const desc = sectionText
          .substring(descStart, descEnd)
          .replace(/\s+/g, ' ')
          .trim();

        if (desc.length > 0) {
          solutions.push({
            solutionLetter: solMatches[i].letter,
            solutionDescription: desc,
          });
        }
      }

    } else {

      // No named solutions — isocratic section
      // Use Mobile phase description as Solution A
      const mpPattern = /\bMobile\s+phase\s*:\s*(.+?)(?=\s*(?:Diluent|Standard\s+(?:stock\s+)?solution|Sample\s+(?:stock\s+)?solution|System\s+suitability|Chromatographic\s+system|Mode\s*:|Detector\s*:|Flow\s+rate|Injection\s+volume|IMPURITIES|SPECIFIC\s+TESTS|$))/is;
      const mpMatch = sectionText.match(mpPattern);

      if (mpMatch) {
        const desc = mpMatch[1].replace(/\s+/g, ' ').trim();
        // Skip "See Table N" — gradient reference, not a description
        if (!/^See\s+Table/i.test(desc)) {
          solutions.push({
            solutionLetter: 'A',
            solutionDescription: desc,
          });
        }
      }
    }

    return solutions;
  }

  private extractSolutionTable(
    sectionText: string,
    now: number
  ): ImpuritiesSolutionTable[] {

    if (!/\bTime\b/i.test(sectionText)) {
      return [];
    }
    if (!/\bSol(?:ution)?[.\s]*[A-K]\b/i.test(sectionText)) {
      return [];
    }

    const tablePattern = /\bTable\s+\d+\b/gi;
    let tableMatch: RegExpExecArray | null;
    const tableMatches: number[] = [];
    while ((tableMatch = tablePattern.exec(sectionText)) !== null) {
      tableMatches.push(tableMatch.index);
    }

    let tableText = '';
    for (let i = tableMatches.length - 1; i >= 0; i--) {
      const candidate = sectionText.substring(tableMatches[i]);
      const hasTime = /\bTime\b/i.test(candidate);
      const hasSol = /\bSol(?:ution)?[.\s]*[A-K]\b/i.test(candidate);

      if (hasTime && hasSol) {
        tableText = candidate;
        break;
      }
    }

    if (!tableText) {
      return [];
    }

    const tableEndMatch = tableText.match(
      /\b(?:Diluent|System\s+suitability|Standard\s+(?:stock\s+)?solution|Sample\s+(?:stock\s+)?solution|Sensitivity\s+solution|Chromatographic\s+system|Mode|Detector|Column|Flow\s+rate|Injection\s+volume|Autosampler)\s*:/i
    );
    if (tableEndMatch?.index !== undefined) {
      tableText = tableText.substring(0, tableEndMatch.index);
    }

    const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const solColumns = allLetters.filter(letter =>
      new RegExp(`\\bSol(?:ution)?[.\\s]*${letter}\\b`, 'i').test(tableText)
    );

    const nCols = solColumns.length;
    if (nCols === 0) {
      return [];
    }

    const parenPattern = /\([^)]*\)/g;
    let parenMatch: RegExpExecArray | null;
    let lastParenEnd = 0;
    while ((parenMatch = parenPattern.exec(tableText)) !== null) {
      lastParenEnd = parenMatch.index + parenMatch[0].length;
    }

    const dataText = tableText.substring(lastParenEnd).trim();

    const numPattern = /[\d]+\.?[\d]*/g;
    let numMatch: RegExpExecArray | null;
    const nums: number[] = [];
    while ((numMatch = numPattern.exec(dataText)) !== null) {
      nums.push(Number(numMatch[0]));
    }

    if (nums.length === 0) {
      return [];
    }

    const tryRowByRow = (): number[][] => {
      const perRow = nCols + 1;
      if (nums.length % perRow !== 0) {
        return [];
      }
      const nRows = nums.length / perRow;
      const rows: number[][] = [];
      for (let i = 0; i < nRows; i++) {
        const t = nums[i * perRow];
        const pcts = nums.slice(i * perRow + 1, (i + 1) * perRow).map(Math.round);
        const sum = pcts.reduce((a, b) => a + b, 0);

        if (pcts.every(p => p >= 0 && p <= 100) && sum === 100) {
          rows.push([t, ...pcts]);
        }
      }

      return rows.length === nRows ? rows : [];
    };

    const tryColByCol = (): number[][] => {
      const nRows = nums.length / (nCols + 1);
      if (!Number.isInteger(nRows) || nRows === 0) return [];
      const timeCol = nums.slice(0, nRows);
      const solCols = Array.from({ length: nCols }, (_, i) =>
        nums.slice((i + 1) * nRows, (i + 2) * nRows)
      );

      const rows: number[][] = [];
      for (let i = 0; i < nRows; i++) {
        const t = timeCol[i];
        const pcts = solCols.map(col => Math.round(col[i]));
        const sum = pcts.reduce((a, b) => a + b, 0);

        if (pcts.every(p => p >= 0 && p <= 100) && sum === 100) {
          rows.push([t, ...pcts]);
        }
      }

      return rows.length === nRows ? rows : [];
    };

    let parsedRows = tryRowByRow();
    if (parsedRows.length === 0) {
      parsedRows = tryColByCol();
    }

    if (parsedRows.length === 0) {
      return [];
    }

    const result = parsedRows.map(row => {
      const obj: ImpuritiesSolutionTable = { solutionTime: row[0] };
      solColumns.forEach((letter, i) => {
        (obj as any)[`solution${letter}Percent`] = row[i + 1];
      });
      return obj;
    });

    return result;
  }

  // Extract specified impurity rows from the table
  private extractImpurityDetails(
    text: string,
    now: number
  ): ImpuritiesDetails[] {

    const details: ImpuritiesDetails[] = [];
    const seenNames = new Set<string>();

    // Pre-process OCR artifacts specific to impurity tables
    // Fix 1a: Letter + hyphen + space + lowercase → merge  "omepra- zole" → "omeprazole"
    text = text.replace(/([A-Za-z])-\s+([a-z])/g, '$1$2');
    // Fix 1b: Digit + hyphen + space + lowercase → keep hyphen  "2- thiol" → "2-thiol"
    text = text.replace(/(\d)-\s+([a-z])/g, '$1-$2');
    // Fix 2: Footnote digits before space+number  "omeprazole9 0.97" → "omeprazole 0.97"
    text = text.replace(/([A-Za-z])\d+(?=\s+[\d.-])/g, '$1');
    // Fix 3: Footnote symbols before space+number  "analog.! 1.16" → "analog 1.16"
    text = text.replace(/[.!~@#$%^&*+=|<>?/\\]+(?=\s+[\d.-])/g, '');
    text = text.replace(/\s+/g, ' ').trim();

    // Locate and isolate the impurity table block
    const tableStartMatch = text.match(/\bTable\s+\d+\b/i);
    if (!tableStartMatch || tableStartMatch.index === undefined) return details;

    let tableText = text.substring(tableStartMatch.index);

    const headerEnd = tableText.match(/NMT\s*\(%\)/i);
    if (headerEnd?.index !== undefined) {
      tableText = tableText.substring(headerEnd.index + headerEnd[0].length);
    }

    const tableEnd = tableText.match(
      /\b(?:SPECIFIC\s+TESTS|ADDITIONAL\s+REQUIREMENTS|Limit\s+of\s+\w)/i
    );
    if (tableEnd?.index !== undefined) {
      tableText = tableText.substring(0, tableEnd.index);
    }

    // Extract dual-RRT rows FIRST, remove from tableText
    // Uses alpha-only name pattern (no digits) so it stops at the first decimal.
    // e.g. "Omeprazole thioxo pyrido analogs 1.55 and 1.64"
    //       → name = "Omeprazole thioxo pyrido analogs"  ✅
    const dualRrtPattern = new RegExp(
      '([A-Z\\d][A-Za-z\\s\\-(),.]+?)' +  // name: alpha only (no standalone decimals)
      '\\s+([\\d]+\\.[\\d]+)' +  // RRT1: must be decimal X.XX
      '\\s+and\\s+' +  // literal "and"
      '([\\d]+\\.[\\d]+)',                   // RRT2: must be decimal X.XX
      'gi'
    );

    const dualRows: { name: string; rrt1: string; rrt2: string }[] = [];

    tableText = tableText.replace(dualRrtPattern, (_, rawName, rrt1, rrt2) => {
      const name = this.cleanImpurityName(rawName);
      if (name.length >= 3 && name.length <= 100) {
        dualRows.push({ name, rrt1, rrt2 });
      }
      return ' ';  // remove from tableText — prevents bleeding into next segment
    });

    // Split remaining tableText on value triplets
    // Each triplet = (decimal_or_integer_or_dash) × 3
    // Result: [name₀, rrt₁, rrf₁, limit₁, name₁, rrt₂, rrf₂, limit₂, ...]
    const VALUE = `(?:[\\d]+\\.?[\\d]*|-)`;
    const sepPat = new RegExp(`\\s+(${VALUE})\\s+(${VALUE})\\s+(${VALUE})(?=\\s|$)`, 'g');
    const segments = tableText.split(sepPat);

    // Labels
    const skipNames = new Set<string>([
      'name', 'total impurities', 'total', '',
    ]);

    const unspecifiedNames = new Set<string>([
      'any unspecified impurity',
      'any other individual impurity',
      'any individual impurity',
      'any unspecified',
      'any other impurity',
    ]);

    // Process each (name, rrt, rrf, limit) segment group
    for (let i = 0; i + 3 < segments.length; i += 4) {
      const name = this.cleanImpurityName(segments[i] ?? '');
      const rrt = (segments[i + 1] ?? '').trim();
      const rrf = (segments[i + 2] ?? '').trim();
      const limit = (segments[i + 3] ?? '').trim();

      if (!name || skipNames.has(name.toLowerCase())) continue;
      if (name.length < 3 || name.length > 100) continue;
      if (/^[\d\s.\-]+$/.test(name)) continue; // pure numbers
      if (seenNames.has(name)) continue;
      // Skip reference peak: RRT≈1.0, RRF=dash, Limit=dash
      if (/^1\.0+$/.test(rrt) && rrf === '-' && limit === '-') continue;

      seenNames.add(name);

      const impurityType = unspecifiedNames.has(name.toLowerCase())
        ? 'UNSPECIFIED IMPURITY'
        : 'SPECIFIED IMPURITY';

      const identityCriteriaList: IdentityCriteria[] = [];
      if (rrt !== '-') identityCriteriaList.push({
        identityCriteriaType: 'RELATIVE RETENTION TIME',
        amountValue: rrt,
      });
      if (rrf !== '-') identityCriteriaList.push({
        identityCriteriaType: 'RELATIVE RESPONSE FACTOR',
        amountValue: rrf,
      });

      details.push({
        impurityType,
        sourceImpurityName: name,
        limitValue: limit !== '-' ? parseFloat(limit) : undefined,
        limitType: 'NMT',
        unit: limit !== '-' ? '%' : undefined,
        identityCriteriaList,
      });
    }

    // Add dual-RRT rows (one entry per RRT value)
    for (const { name, rrt1, rrt2 } of dualRows) {
      if (seenNames.has(name)) continue;
      seenNames.add(name);     // add once — prevents duplicate entries

      for (const rrt of [rrt1, rrt2]) {
        details.push({
          impurityType: 'SPECIFIED IMPURITY',
          sourceImpurityName: name,
          limitValue: undefined,
          limitType: 'NMT',
          unit: undefined,
          identityCriteriaList: [{
            identityCriteriaType: 'RELATIVE RETENTION TIME',
            amountValue: rrt,
          }],
        });
      }
    }

    return details;
  }

  // Shared name cleaner for impurity table rows
  private cleanImpurityName(raw: string): string {
    let name = raw.replace(/\s+/g, ' ').trim();
    // Strip trailing footnote digits
    name = name.replace(/\s*\d+\s*$/, '').trim();
    // Strip non-alpha/hyphen/paren symbols
    name = name.replace(/[^A-Za-z0-9\s\-()\-,.]/g, '').trim();
    // Strip leading standalone digit (e.g. "5 Omeprazole" → "Omeprazole")
    // but NOT "5-Methoxy" (digit directly followed by hyphen)
    name = name.replace(/^\d+\s+(?=[A-Z])/g, '').trim();
    // Take the last capital-starting phrase (strips header bleed)
    const lastPhrase = name.match(/[A-Z\d][A-Za-z0-9\s\-(),.]*$/);
    return lastPhrase ? lastPhrase[0].trim() : name;
  }

  // Extract unspecified impurity limits
  private extractUnspecified(
    text: string,
    now: number
  ): ImpuritiesUnspecified[] {
    const unspecified: ImpuritiesUnspecified[] = [];
    const match = text.match(
      /[Aa]ny\s+other\s+individual\s+impurity[^\d]*([\d.]+)%?/
    );
    if (match) {
      unspecified.push({
        impurityType: 'UNSPECIFIED IMPURITY',
        // limitValue: match[1],
        limitType: 'NMT',
        unit: '%',
        identityCriteriaList: []
      });
    }
    return unspecified;
  }

  private extractInorganicImpurities(
    text: string,
    source: string,
    sourceType: string,
    sourceId: string
  ): ImpuritiesInorganicTest[] {

    // Matches all OCR variants seen across USP monographs:
    //   Standard:  "Residue on Ignition (281): NMT 0.1%"
    //   OCR var 1: "RESIDUE ON IGNITION 281 _: NMT 0.1 %"  ← underscore before colon
    //   OCR var 2: "Resipue on Ienimion (281): NMT 0.1%"   ← garbled name
    //   OCR var 3: "Residue on Ignition (281) NMT 0.1%"    ← no colon
    //   OCR var 4: "+ Residue on Ignition (281): NMT 0.1%" ← bullet prefix
    //
    // Pattern breakdown:
    //   Res\w+\s+on\s+\w+    → fuzzy match for "Residue on Ignition" (any OCR variant)
    //   (?:\(?\s*281\s*\)?)?  → optional (281) with or without parens
    //   [\s_.:]*              → any separators including underscore
    //   (NMT|NLT)?            → optional limit type keyword
    //   \s*([\d.]+)\s*(%)?    → limit value and optional unit

    const match = text.match(
      /Res\w+\s+on\s+\w+\s*(?:\(?\s*281\s*[_.]?\s*\)?)?\s*[\s_.:]*\s*(NMT|NLT)?\s*([\d.]+)\s*(%)?/i
    );

    if (!match) return [];

    const limitType = match[1]?.toUpperCase() ?? 'NMT';
    const limitValue = match[2];

    const inorganicEntry: ImpuritiesInorganic = {
      substanceName: '',
      limitValue,
      limitType,
      unit: '%',
      testType: 'Residue on Ignition (281)',
      comments: '',
    };

    const inorganicTest: ImpuritiesInorganicTest = {
      sourceType,
      source,
      sourceId,
      test: 'INORGANIC IMPURITIES',
      testType: '',
      impuritiesInorganicList: [inorganicEntry],
    };

    return [inorganicTest];
  }

  // Extract total impurities limit
  private extractTotal(text: string): ImpuritiesTotal {

    const match = text.match(
      /[Tt]otal\s+impurit(?:y|ies)[^%\d]*?(NMT|NLT)?\s*([\d.]+)\s*(%)?/i
    );

    if (!match) {
      return {};
    }

    const rawLimitType = match[1]?.toUpperCase() ?? 'NMT';
    const limitValue = match[2];

    return {
      limitValue,
      limitType: rawLimitType,
      unit: '%',
    };
  }

  /***** IMPORT USP MONOGRAPH END **************************************************************/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/



  /*###########################################################################################*/
  /******IMPORT EP MONOGRAPSH START ************************************************************/

  async epMapToImpuritiesModel(extractedDoc: ExtractedDocument): Promise<Impurities> {

    const rawText = extractedDoc.fullText;
    const substanceName = this.epDetectSubstanceName(rawText);
    const cleanText = this.healOcrArtifacts(rawText, substanceName);

    if (substanceName) {
      await this.getSubstanceNameDetails(substanceName);
    }

    const { source, sourceType } = this.epDetectSource(cleanText);
    const sourceId = '';
    const { assayLow, assayHigh, unit } = this.epDetectAssayLimits(cleanText);

    const testsIdx = cleanText.search(/\bTESTS\b/i);
    const assayIdx = cleanText.search(/\bASSAY\b/i);
    const impuritiesIdx = cleanText.search(/\bIMPURITIES\b/i);
    const storageIdx = cleanText.search(/\bSTORAGE\b/i);

    // Full TESTS block — from TESTS to ASSAY
    const testsBlock = (testsIdx !== -1 && assayIdx !== -1)
      ? cleanText.substring(testsIdx, assayIdx)
      : '';

    // Scope to "Related substances" sub-section within TESTS
    // EP TESTS block contains multiple sub-tests:
    //   "Solution S.", "Enantiomeric purity.", "Related substances.", etc.
    // We only want "Related substances" for the ORGANIC IMPURITIES test.
    // Each sub-section starts with a Title Case heading followed by "."
    // and ends at the next sub-section heading or ASSAY.
    let relSubstText = '';

    if (testsBlock) {
      // Find "Related substances." within the TESTS block
      const relSubstIdx = testsBlock.search(/\bRelated\s+substances\b/i);

      if (relSubstIdx !== -1) {
        // End at the next sub-section heading or end of TESTS block
        // EP sub-section headings: "Loss on drying", "Sulfated ash", "ASSAY", etc.
        const relSubstEnd = testsBlock.substring(relSubstIdx).search(
          /\n?(?:Loss\s+on\s+drying|Sulfated\s+ash|Heavy\s+metals|Water\s+\(|ASSAY|Magnesium)/i
        );
        relSubstText = relSubstEnd !== -1
          ? testsBlock.substring(relSubstIdx, relSubstIdx + relSubstEnd)
          : testsBlock.substring(relSubstIdx);
      } else {
        // No "Related substances" label — use full TESTS block as fallback
        relSubstText = testsBlock;
      }
    }

    const impuritiesTestList: ImpuritiesTesting[] = [];

    if (relSubstText && /Liquid chromatography|spectrophotometer/i.test(relSubstText)) {
      impuritiesTestList.push(
        this.epMapToTest(
          'ORGANIC IMPURITIES',
          relSubstText,         // ← now scoped to Related substances only
          source,
          sourceId,
          sourceType
        )
      );
    }

    const impuritiesTotal = this.epExtractTotal(cleanText);
    const impuritiesInorganicTestList = this.epExtractInorganicImpurities(
      cleanText, source, sourceType, sourceId
    );

    const substance: ImpuritiesSubstance = {
      substanceUuid: this.substanceUuid ?? '',
      approvalID: this.substanceApprovalId ?? '',
      low: assayLow,
      high: assayHigh,
      unit,
      impuritiesTestList,
      impuritiesResidualSolventsTestList: [],
      impuritiesInorganicTestList,
    };

    return {
      source,
      sourceType,
      sourceId,
      type: 'DRUG SUBSTANCE',
      specType: 'Accepted',
      productId: this.substanceApprovalId,
      productSubstanceName: substanceName,
      submitterName: 'EP',
      impuritiesSubstanceList: [substance],
      impuritiesTotal,
    };
  }

  epDetectSubstanceName(text: string): string {

    // EP header structure in flat PDF.js text (no newlines):
    // "EUROPEAN PHARMACOPOEIA 07/2021:0942 Omeprazole OMEPRAZOLE Omeprazolum ..."
    // "EUROPEAN PHARMACOPOEIA 01/2026:2372 Esomeprazole magnesium trihydrate ESOMEPRAZOLE..."
    //
    // The substance name ALWAYS appears immediately after the monograph number
    // in Title Case (Capital + lowercase), before the first ALL-CAPS word.

    // Name immediately after monograph number "XX/YYYY:NNNN"
    // Stops before the first all-caps word (e.g. OMEPRAZOLE, ESOMEPRAZOLE)
    const monoMatch = text.match(
      /\d{2}\/\d{4}:\d{4}\s+([A-Z][a-z][A-Za-z\s\-]*?)(?=\s+[A-Z]{3,})/
    );
    if (monoMatch) {
      const candidate = monoMatch[1].trim();
      if (candidate.length > 2 && candidate.length < 100) {
        // Reject Latin INN names ending in -um, -us, -ium (e.g. "Omeprazolum")
        if (!/\b\w+(?:um|us|ium)\s*$/i.test(candidate)) {
          return candidate;
        }
      }
    }

    // First Title Case sequence after "EUROPEAN PHARMACOPOEIA"
    // Handles cases where monograph number format varies
    const epMatch = text.match(
      /EUROPEAN\s+PHARMACOPOEIA\s+[\d/:.]+\s+([A-Z][a-z][A-Za-z]*(?:\s+[A-Z][a-z][A-Za-z]*)*)/i
    );
    if (epMatch) {
      const candidate = epMatch[1].trim();
      if (candidate.length > 2 && !/\b\w+(?:um|us|ium)\s*$/i.test(candidate)) {
        return candidate;
      }
    }

    // Strategy 3: First Title Case name before DEFINITION
    // Zone: from start of text to "DEFINITION"
    const defIdx = text.toLowerCase().indexOf('definition');
    if (defIdx !== -1) {
      const zone = text.substring(0, defIdx);
      const titleMatch = zone.match(
        /([A-Z][a-z][A-Za-z]*(?:\s+[A-Z][a-z][A-Za-z]*)*)/
      );
      if (titleMatch) {
        const candidate = titleMatch[1].trim();
        if (candidate.length > 3 &&
          !/\b\w+(?:um|us|ium)\s*$/i.test(candidate) &&
          !/^European|^Pharmacopoeia/i.test(candidate)) {
          return candidate;
        }
      }
    }

    return '';
  }

  epDetectSource(text: string): { source: string; sourceType: string } {
    if (/EUROPEAN\s+PHARMACOPOEIA|Ph\.?\s*Eur\.?/i.test(text)) {
      return { source: 'EP', sourceType: 'MONOGRAPH' };
    }
    return { source: 'EP', sourceType: 'MONOGRAPH' };
  }

  epDetectAssayLimits(text: string): { assayLow: number; assayHigh: number; unit: string } {

    // Format 1: "Content: 99.0 per cent to 101.0 per cent"
    const contentMatch = text.match(
      /Content:\s*([\d.]+)\s*per cent\s+to\s+([\d.]+)\s*per cent/i
    );
    if (contentMatch) {
      return {
        assayLow: parseFloat(contentMatch[1]),
        assayHigh: parseFloat(contentMatch[2]),
        unit: '%',
      };
    }

    // Format 2: "98.0 per cent to 102.0 per cent" (no "Content:" label)
    const rangeMatch = text.match(/([\d.]+)\s*per cent\s+to\s+([\d.]+)\s*per cent/i);
    if (rangeMatch) {
      return {
        assayLow: parseFloat(rangeMatch[1]),
        assayHigh: parseFloat(rangeMatch[2]),
        unit: '%',
      };
    }

    return { assayLow: 0, assayHigh: 0, unit: '%' };
  }

  epDetectMobilePhase(sectionText: string): string {
    const match = sectionText.match(
      /Mobile phase:\s*(.+?)(?=\s*(?:Flow rate|Detection|Injection|Run time|System suitability|Limits|$))/is
    );
    return match ? match[1].replace(/\s+/g, ' ').trim() : '';
  }

  epDetectColumn(sectionText: string): {
    columnSize: string;
    columnPackingSize: string;
    columnPackingType: string;
  } {
    // Size: convert metres to cm  "l=0.125 m, O=4.6 mm" → "4.6-mm x 12.5-cm"
    const sizeMatch = sectionText.match(
      /size:\s*l\s*=\s*([\d.]+)\s*m[,;]?\s*[OØ@]\s*=\s*([\d.]+)\s*mm/i
    );
    let columnSize = '';
    if (sizeMatch) {
      const lengthCm = (parseFloat(sizeMatch[1]) * 100).toFixed(0);
      const diamMm = sizeMatch[2];
      columnSize = `${diamMm}-mm x ${lengthCm}-cm`;
    }

    // Stationary phase: "octylsilyl silica gel for chromatography R (5 um)"
    const statMatch = sectionText.match(
      /stationary phase:\s*(.+?)(?:\((\d+)\s*[uµ]m\))?(?=\.|Mobile phase|Flow rate|$)/is
    );

    let columnPackingType = '';
    let columnPackingSize = '';

    if (statMatch) {
      const statDesc = statMatch[1].trim();
      const sizeNum = statMatch[2];

      // Map EP stationary phase descriptions to USP L-codes
      const packingMap: { [key: string]: string } = {
        'octylsilyl': 'L7',   // C8
        'octadecylsilyl': 'L1',   // C18
        'phenyl': 'L11',
        'cyano': 'L10',
        'aminopropylsilyl': 'L8',
        'acid-glycoprotein': 'L57', // chiral
      };

      const packingType = Object.entries(packingMap)
        .find(([key]) => new RegExp(key, 'i').test(statDesc));

      columnPackingType = packingType ? packingType[1] : statDesc.substring(0, 30);
      columnPackingSize = sizeNum ? `${sizeNum}-µm packing` : '';
    }

    return { columnSize, columnPackingSize, columnPackingType };
  }

  epDetectChromatographicParams(sectionText: string): {
    flowRate: string;
    detectorWavelength: string;
    injectionVolumeAmount: string;
  } {
    // Handles: "Flow rate: 1 mL/min."  "Flow rate : 0.6 mL/min."  "Flow rate: 1 ml/min."
    const flowMatch = sectionText.match(/Flow\s+rate\s*:\s*([\d.]+\s*m[lL]\/min)/i);

    // Handles: "Detection: spectrophotometer at 280 nm."
    const detMatch = sectionText.match(/Detection:\s*spectrophotometer\s+at\s+([\d]+)\s*nm/i);

    // Handles: "Injection: 40 uL."  "Injection: 20 µL."
    const injMatch = sectionText.match(/Injection:\s*([\d.]+\s*[uµ]L)/i);

    return {
      flowRate: flowMatch ? flowMatch[1].trim().replace('ml', 'mL') : '',
      detectorWavelength: detMatch ? `${detMatch[1]} nm` : '',
      injectionVolumeAmount: injMatch ? injMatch[1].replace('u', 'µ').trim() : '',
    };
  }

  epDetectSolutions(sectionText: string): { [key: string]: string } {

    const getField = (anchor: string): string => {
      const pat = new RegExp(`${anchor}\\s*\\.?\\s*(.+?)(?=\\s*(?:Reference solution|Test solution|Column|Mobile phase|Flow rate|System suitability|Limits|$))`, 'is');
      const m = sectionText.match(pat);
      return m ? m[1].replace(/\s+/g, ' ').trim() : '';
    };

    return {
      // "Test solution" → sampleSolution
      sampleSolution: getField('Test solution'),

      // "Reference solution (a)" → standardSolution (primary reference)
      standardSolution: getField('Reference solution\\s*\\(a\\)'),

      // "Reference solution (b)" → systemSuitabilitySolution
      systemSuitabilitySolution: getField('Reference solution\\s*\\(b\\)'),

      // "Reference solution (c)" if present
      sensitivitySolution: getField('Reference solution\\s*\\(c\\)'),
    };
  }

  epDetectSystemSuitability(sectionText: string): { [key: string]: string } {

    // Isolate suitability block
    const blockMatch = sectionText.match(
      /System suitability[:\s]*reference solution[^:]*:?\s*(.+?)(?=\s*(?:Limits:|Loss on drying|Sulfated ash|ASSAY|$))/is
    );
    if (!blockMatch) return {};
    const block = blockMatch[1];

    // Resolution: "- resolution: minimum 3.0 between..."
    const resMatch = block.match(/resolution:\s*minimum\s*([\d.]+)\s*between(.+?)(?=\n-|signal|$)/is);

    // Signal-to-noise: "- signal-to-noise ratio: minimum 10..."
    const snMatch = block.match(/signal.to.noise\s+ratio:\s*minimum\s*([\d.]+)/i);

    return {
      suitabilityReqResolution: resMatch
        ? `NLT ${resMatch[1]} between${resMatch[2].replace(/\s+/g, ' ').trim()}`
        : '',
      systemSuitabilitySignalToNoiseRatio: snMatch
        ? `NLT ${snMatch[1]}`
        : '',
      systemSuitabilitySample: 'Reference solution (a)',
    };
  }

  epExtractImpurityDetails(text: string, now: number): ImpuritiesDetails[] {

    const details: ImpuritiesDetails[] = [];

    // Step 1: Extract limit values from "Limits:" block
    const limitsBlock = text.match(
      /Limits:\s*(.+?)(?=\s*(?:Loss on drying|Sulfated ash|ASSAY|STORAGE|$))/is
    );
    if (!limitsBlock) return details;

    const limText = limitsBlock[1];

    // Parse each "- name: ... (X.XX per cent)" line
    const limitLines = limText.matchAll(
      /-\s*([^:]+?):\s*[^(]*\(([\d.]+)\s*per cent\)/gi
    );

    const limitMap: { [key: string]: string } = {};
    for (const m of limitLines) {
      const rawName = m[1].trim().toLowerCase();
      const val = m[2];
      // Parse "impurities D, E" → map each letter
      const letters = rawName.match(/[A-Z]/gi);
      if (letters && !rawName.includes('unspecified') && !rawName.includes('total')) {
        letters.forEach(l => { limitMap[l.toUpperCase()] = val; });
      } else if (rawName.includes('unspecified')) {
        limitMap['UNSPECIFIED'] = val;
      }
    }

    // Extract relative retention times from body text
    // "impurity E = about 0.6; impurity D = about 0.8"
    const rrtMap: { [key: string]: string } = {};
    const rrtMatches = text.matchAll(
      /impurity\s+([A-Z])\s*=\s*about\s*([\d.]+)/gi
    );
    for (const m of rrtMatches) {
      rrtMap[m[1].toUpperCase()] = m[2];
    }

    // Extract impurity name definitions from IMPURITIES section
    // "A. 5-methoxy-1H-benzimidazole-2-thiol,"
    // "D. 5-methoxy-2-[...] (omeprazole sulfone),"
    const impSection = text.match(/IMPURITIES\s*(.+)$/is);
    const nameMap: { [key: string]: string } = {};

    if (impSection) {
      // Specified impurities list: "Specified impurities: D, E, F, G."
      const specifiedMatch = impSection[1].match(/Specified impurities:\s*([A-Z,\s]+)\./i);
      const specifiedLetters = specifiedMatch
        ? specifiedMatch[1].split(',').map(s => s.trim())
        : [];

      // Named definitions: "A. description text,"
      const defMatches = impSection[1].matchAll(
        /\b([A-Z])\.\s+([^.]+?)(?=\n[A-Z]\.|General Notices|$)/gis
      );
      for (const m of defMatches) {
        const letter = m[1].toUpperCase();
        const name = m[2].replace(/\s+/g, ' ').trim();
        // Extract short name from parenthetical if present: "(omeprazole sulfone)"
        const shortName = name.match(/\(([^)]+)\)/);
        nameMap[letter] = shortName ? shortName[1] : name.substring(0, 80);
      }

      // Build details for each impurity that has a limit
      const allLetters = [...new Set([
        ...Object.keys(limitMap).filter(k => k !== 'UNSPECIFIED'),
        ...specifiedLetters,
      ])];

      for (const letter of allLetters) {
        const impName = nameMap[letter] ?? `Impurity ${letter}`;
        const limit = limitMap[letter];
        const rrt = rrtMap[letter];

        const identityCriteriaList: IdentityCriteria[] = [];
        if (rrt) {
          identityCriteriaList.push({
            identityCriteriaType: 'RELATIVE RETENTION TIME',
            amountValue: rrt,
          });
        }

        details.push({
          impurityType: 'SPECIFIED IMPURITY',
          sourceImpurityName: impName,
          limitValue: limit ? parseFloat(limit) : undefined,
          limitType: 'NMT',
          unit: limit ? '%' : undefined,
          identityCriteriaList,
        });
      }

      // Unspecified impurities
      if (limitMap['UNSPECIFIED']) {
        details.push({
          impurityType: 'UNSPECIFIED IMPURITY',
          sourceImpurityName: 'Any other unspecified impurity',
          limitValue: parseFloat(limitMap['UNSPECIFIED']),
          limitType: 'NMT',
          unit: '%',
          identityCriteriaList: [],
        });
      }
    }

    return details;
  }

  epExtractTotal(text: string): ImpuritiesTotal {

    const match = text.match(
      /-\s*total:\s*[^(]*\(([\d.]+)\s*per cent\)/i
    );

    if (!match) return {};

    return {
      limitValue: match[1],
      limitType: 'NOT MORE THAN',
      unit: '%',
    };
  }

  epExtractInorganicImpurities(
    text: string,
    source: string,
    sourceType: string,
    sourceId: string
  ): ImpuritiesInorganicTest[] {

    const match = text.match(
      /Sulfated\s+ash\s*(?:\([^)]+\))?\s*:\s*maximum\s*([\d.]+)\s*per cent/i
    );

    if (!match) return [];

    const inorganicEntry: ImpuritiesInorganic = {
      substanceName: '',
      limitValue: match[1],
      limitType: 'NMT',
      unit: '%',
      testType: '',
      comments: '',
    };

    return [{
      sourceType,
      source,
      sourceId,
      test: 'INORGANIC IMPURITIES',
      testType: '',
      impuritiesInorganicList: [inorganicEntry],
    }];
  }

  private epMapToTest(
    testLabel: string,
    sectionText: string,
    source: string,
    sourceId: string,
    sourceType: string
  ): ImpuritiesTesting {

    const now = Date.now();

    const mobilePhaseFull = this.epDetectMobilePhase(sectionText);
    const { columnSize, columnPackingSize, columnPackingType } = this.epDetectColumn(sectionText);
    const { flowRate, detectorWavelength, injectionVolumeAmount } = this.epDetectChromatographicParams(sectionText);
    const solutions = this.epDetectSolutions(sectionText);
    const suitability = this.epDetectSystemSuitability(sectionText);

    const impuritiesAnalysisList = [];

    const impuritiesDetailsList = this.epExtractImpurityDetails(sectionText, now);
    const impuritiesSolutionTableList = this.extractSolutionTable(sectionText, now);
    const elutionType = impuritiesSolutionTableList.length > 0 ? 'Gradient' : 'ISOCRATIC';
    const impuritiesSolutionList = this.epExtractSolution(sectionText, now);

    return {
      test: testLabel,
      testType: 'HPLC/UV',
      sourceType,
      source,
      sourceId,
      buffer: '',
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
      diluent: '',
      standardSolution: solutions['standardSolution'],
      systemSuitabilitySolution: solutions['systemSuitabilitySolution'],
      sampleSolution: solutions['sampleSolution'],
      ...(solutions['sensitivitySolution'] ? { sensitivitySolution: solutions['sensitivitySolution'] } : {}),
      systemSuitabilitySample: suitability['systemSuitabilitySample'] ?? 'Reference solution (a)',
      ...(suitability['suitabilityReqResolution'] ? { suitabilityReqResolution: suitability['suitabilityReqResolution'] } : {}),
      ...(suitability['systemSuitabilitySignalToNoiseRatio'] ? { systemSuitabilitySignalToNoiseRatio: suitability['systemSuitabilitySignalToNoiseRatio'] } : {}),
      impuritiesElutionSolventList: [],
      impuritiesSolutionList,
      impuritiesSolutionTableList,
      impuritiesAnalysisList,
      impuritiesDetailsList,
      impuritiesUnspecifiedList: [],
    };
  }

  private epExtractSolution(
    sectionText: string,
    now: number
  ): ImpuritiesSolution[] {

    const solutions: ImpuritiesSolution[] = [];

    // EP does not use "Solution A:", "Solution B:" declarations.
    // Instead the mobile phase itself IS the solution.
    // Store it as Solution A — consistent with how isocratic USP sections work.
    //
    // EP mobile phase format:
    //   "Mobile phase: mix 27 volumes of acetonitrile R and 73 volumes of
    //    a 1.4 g/L solution of disodium hydrogen phosphate dodecahydrate R
    //    previously adjusted to pH 7.6 with phosphoric acid R."

    const mpMatch = sectionText.match(
      /Mobile phase:\s*(.+?)(?=\s*(?:Flow rate|Detection|Injection|Run time|System suitability|Limits|Column|$))/is
    );

    if (mpMatch) {
      const desc = mpMatch[1].replace(/\s+/g, ' ').trim();
      if (desc.length > 2) {
        solutions.push({
          solutionLetter: 'A',
          solutionDescription: desc,
        });
      }
    }

    return solutions;
  }

  /***** IMPORT EP MONOGRAPH END ***************************************************************/
  /*###########################################################################################*/


  /******************************************************************************************* */

  getSubstanceNameDetails(ingredientName: string): Promise<void> {
    return new Promise((resolve) => {

      if (!ingredientName) {
        resolve();
        return;
      }

      const sub = this.generalService
        .getSubstanceByNameExactMatch(ingredientName)
        .subscribe({
          next: (response) => {
            if (response?.content?.length > 0) {

              for (const substance of response.content) {
                if (substance?.names?.length > 0) {

                  for (const nameObj of substance.names) {
                    if (nameObj?.name &&
                      nameObj.name.toUpperCase() === ingredientName.toUpperCase()) {

                      this.substanceApprovalId = substance.approvalID;
                      this.substanceUuid = substance.uuid;
                      break;  // found — stop searching
                    }
                  }
                }
              }
            }
            resolve();   // ← always resolve, even if no match found
          },
          error: (err) => {
            console.warn(`Could not find substance for: ${ingredientName}`, err);
            resolve();   // ← resolve on error too — do not block mapping
          }
        });

      this.subscriptions.push(sub);
    });
  }

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