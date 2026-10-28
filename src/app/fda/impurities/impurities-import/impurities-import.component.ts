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
  ImpuritiesResidualSolvents, ImpuritiesInorganicTest, ImpuritiesInorganic, ImpuritiesSpecificTest, ImpuritiesAdditionalRequirements,
  ImpuritiesTotal, SubRelationship, ValidationMessage, ImpurityStructure
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
  existingImpurities: Array<SubRelationship> = [];

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

  // FOR DEBUGGING ******
  debugStructureImages: Array<{ code: string, url: string }> = [];

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

    // Detect pharmacopoeia from raw PDF text and go to correct import function
    const pharmacopoeia = this.detectPharmacopoeia(extractedDoc.fullText);

    let impurities: Impurities | null = null;

    if (pharmacopoeia === 'USP') {
      impurities = await this.mapToImpuritiesModel(extractedDoc);

    } else if (pharmacopoeia === 'EP') {
      impurities = await this.europeanMapToImpuritiesModel(extractedDoc, file);

    } else {
      console.warn(
        'Could not determine pharmacopoeia from the PDF. ' +
        'Please make sure the file is a valid USP or EP monograph.'
      );
      return;  // stop here and do not load an empty form
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
    if (/\d{2}\/\d{4}:\d{4}/.test(text)) return 'EP';

    // USP indicators
    if (/Document\s+Type:\s*USP\s+Monographs/i.test(text)) return 'USP';
    if (/USPC|uspnf\.com|USP-NF/i.test(text)) return 'USP';
    if (/Do\s+not\s+distribute/i.test(text)) return 'USP';

    return 'UNKNOWN';
  }

  async extractTextFromFile(file: File): Promise<ExtractedDocument> {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false,
      cMapUrl: `${environment.baseHref || ''}assets/cmaps/`,
      cMapPacked: true,
    }).promise;

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

  // Main mapping entry point - read USP Monograph from pdf
  async mapToImpuritiesModel(extractedDoc: ExtractedDocument): Promise<Impurities> {
    const sourceId = '';

    // Extract Substance Name
    this.substanceName = this.extractSubstanceName(extractedDoc.fullText);

    // Clean OCR texts
    const cleanText = this.healOcrArtifacts(extractedDoc.fullText, this.substanceName);

    // Find what's in rawText near pH
    const rawPHIndex = extractedDoc.fullText.indexOf('pH');
    if (rawPHIndex > -1) {
      const snippet = extractedDoc.fullText.slice(rawPHIndex - 5, rawPHIndex + 15);
    }

    // ADD THIS:
    const phlIndex = extractedDoc.fullText.indexOf('pHL');
    if (phlIndex > -1) {
      const snippet = extractedDoc.fullText.slice(phlIndex - 5, phlIndex + 10);
      const charCodes = Array.from(snippet).map(c => `${c}(${c.charCodeAt(0)})`).join(' ');
    }

    // Slice SECTIONS - Assay, Impurities, Specific Tests, Additional Requirements
    const {
      assayText,
      impuritiesText,
      limitTestTexts,
      enantiomericPurityText,
      specificTestsText,
      additionalRequirementsText
    } = this.splitSections(cleanText);

    // Get Substance Name Details
    if (this.substanceName) {
      await this.getSubstanceNameDetails(this.substanceName);
    }

    const { source, sourceType } = this.extractSource(cleanText);
    const { dateType, dateTypeDate } = this.extractDateType(cleanText);
    const { assayLow, assayHigh, unit } = this.extractAssayLimits(cleanText);

    const impuritiesTestList: ImpuritiesTesting[] = [];

    const impuritiesTotal = this.extractTotal(extractedDoc.fullText);

    // ***** Test — ASSAY
    if (assayText && /LC|HPLC|UV\s+\d{3}/i.test(assayText)) {

      const test1 = await this.mapToTest(
        'ASSAY',
        assayText,
        assayText,
        source,
        sourceType,
        sourceId
      );

      impuritiesTestList.push(test1);
    }

    // ***** Test — ORGANIC IMPURITIES or RELATED SUBSTANCES
    if (impuritiesText && /LC|HPLC|UV\s+\d{3}/i.test(impuritiesText)) {
      const testLabel = /ORGANIC IMPURITIES/i.test(impuritiesText)
        ? 'ORGANIC IMPURITIES'
        : /RELATED SUBSTANCES/i.test(impuritiesText)
          ? 'RELATED SUBSTANCES'
          : 'INORGANIC IMPURITIES';

      const test2 = await this.mapToTest(
        testLabel,
        impuritiesText,
        assayText,
        source,
        sourceType,
        sourceId
      );

      impuritiesTestList.push(test2);
    }

    // ***** Test — ENANTIOMERIC PURITY
    if (enantiomericPurityText && /LC|HPLC|UV\s+\d{3}/i.test(enantiomericPurityText)) {
      const test4 = await this.mapToTest(
        'ENANTIOMERIC PURITY',
        enantiomericPurityText,
        assayText,
        source,
        sourceType,
        sourceId
      );
      impuritiesTestList.push(test4);
    }

    // Tests — LIMIT OF ... (e.g. LIMIT OF HYDRAZINE)
    // Each limit test is mapped independently via mapToTest
    for (const limitTest of limitTestTexts) {
      if (/LC|HPLC|UV\s+\d{3}/i.test(limitTest.text)) {
        // Chromatographic limit test — map via mapToTest

        const test3 = await this.mapToTest(
          limitTest.label,
          limitTest.text,
          assayText,
          source,
          sourceType,
          sourceId
        );

        impuritiesTestList.push(test3);

      } else {
        // Non-chromatographic limit test — map as minimal test entry
        const analysisData = this.extractAnalysisList(limitTest.text, limitTest.label);
        impuritiesTestList.push({
          test: limitTest.label,
          testType: 'OTHER',
          sourceType,
          source,
          sourceId,
          system: '',
          mode: '',
          detectionType: '',
          impuritiesAnalysisList: [{
            samples: analysisData['samples'],
            description: analysisData['description'],
            resultFormula: analysisData['resultFormula'],
            formulaRU: analysisData['formulaRU'],
            formulaRS: analysisData['formulaRS'],
            formulaCS: analysisData['formulaCS'],
            formulaCU: analysisData['formulaCU'],
            formulaF: analysisData['formulaF'],
            formulaP: analysisData['formulaP'],
            formulaMR1: analysisData['formulaMR1'],
            formulaMR2: analysisData['formulaMR2'],
          }],
          impuritiesSolutionList: [],
          impuritiesSolutionTableList: [],
          impuritiesDetailsList: [],
          impuritiesUnspecifiedList: [],
        });
      }
    }

    // Extract Inorganic Impurities or Residue on Ignition
    const impuritiesInorganicTestList: ImpuritiesInorganicTest[] =
      this.extractInorganicImpurities(extractedDoc.fullText, source, sourceType, sourceId);

    // Extract Residual Solvent or Loss on Drying
    const impuritiesResidualSolventsTestList: ImpuritiesResidualSolventsTest[] =
      this.extractResidualSolventsTest(extractedDoc.fullText, source, sourceType, sourceId);

    // Extract SPECIFIC TESTS
    const impuritiesSpecificTestList: ImpuritiesSpecificTest[] =
      specificTestsText?.trim() ? this.extractSpecificTests(specificTestsText) : [];

    // Extract USP Reference Standards
    const impuritiesAdditionalRequirements =
      this.extractReferenceStandards(additionalRequirementsText);


    // Extract Substance Details    
    const substance: ImpuritiesSubstance = {
      substanceUuid: this.substanceUuid,
      approvalID: this.substanceApprovalId,
      low: assayLow,
      high: assayHigh,
      unit,
      impuritiesTestList,
      impuritiesResidualSolventsTestList,
      impuritiesInorganicTestList,
      impuritiesSpecificTestList
    };

    return {
      source,
      sourceType,
      sourceId,
      type: 'DRUG SUBSTANCE',
      specType: '',
      productId: this.substanceApprovalId,
      productSubstanceName: this.substanceName,
      submitterName: '',
      dateType,
      dateTypeDate,
      impuritiesSubstanceList: [substance],
      impuritiesTotal,
      impuritiesAdditionalRequirements: impuritiesAdditionalRequirements ?? undefined
    };
  }

  splitSections(fullText: string): {
    assayText: string;
    impuritiesText: string;
    limitTestTexts: { label: string; text: string }[];
    enantiomericPurityText: string;
    specificTestsText: string;
    additionalRequirementsText: string;  // ← ADDED
  } {
    const assayIdx = fullText.search(/\bASSAY\b/i);
    const impuritiesIdx = fullText.search(/\bIMPURITIES\b|\bORGANIC\s+IMPURITIES\b|\bRELATED\s+SUBSTANCES\b/i);
    const specificIdx = fullText.search(/\bSPECIFIC\s+TESTS\b/i);
    const additionalIdx = fullText.search(/\bADDITIONAL\s+REQUIREMENTS\b/i);

    // ASSAY BLOCK 
    const assayText =
      assayIdx > -1
        ? fullText.slice(
          assayIdx,
          impuritiesIdx > assayIdx ? impuritiesIdx : fullText.length
        )
        : '';

    // IMPURITIES BLOCK
    const impuritiesEnd =
      specificIdx > -1 ? specificIdx :
        additionalIdx > -1 ? additionalIdx :
          fullText.length;

    const impuritiesBlock = fullText.slice(
      impuritiesIdx > -1 ? impuritiesIdx : 0,
      impuritiesEnd
    );

    // SPECIFIC TESTS
    const specificTestsText = this.getSpecificTestsSection(
      fullText,
      specificIdx,
      additionalIdx
    );

    // ADDITIONAL REQUIREMENTS
    // Slice from ADDITIONAL REQUIREMENTS to end, then strip the USP-NF
    // "Auxiliary Information" footer that appears after the RS entries.
    const additionalRequirementsText = additionalIdx > -1
      ? fullText
        .slice(additionalIdx)
        .replace(/Auxiliary\s+Information[\s\S]*/i, '')
        .trim()
      : '';

    // ENANTIOMERIC PURITY
    const enantiomericIdx = impuritiesBlock.search(/[•+*]?\s*\bENANTIOMERIC\s+PURITY\b/i);
    let enantiomericPurityText = '';

    if (enantiomericIdx > -1) {
      const enantiomericEnd = impuritiesBlock.search(/\bSPECIFIC\s+TESTS\b/i);
      enantiomericPurityText = impuritiesBlock.slice(
        enantiomericIdx,
        enantiomericEnd > enantiomericIdx ? enantiomericEnd : impuritiesBlock.length
      );
    }

    // LIMIT OF sub-tests
    const firstLimitIdx = impuritiesBlock.search(
      /[•+*]?\s*(?:\bLIMIT\s+OF\s+[A-Z]|\bENANTIOMERIC\s+PURITY\b)/i
    );

    const organicImpuritiesText = firstLimitIdx > -1
      ? impuritiesBlock.slice(0, firstLimitIdx)
      : impuritiesBlock;

    const limitPattern =
      /[•+*]?\s*\bLIMIT\s+OF\s+([A-Z][A-Z\s\-]+?)(?=\s*(?:Buffer|Mobile\s+phase|Standard|Sample|Chromatographic|Benzaldehyde|Acetonitrile\s+solution|$))/gi;

    const limitStarts: { label: string; index: number }[] = [];
    let limitMatch: RegExpExecArray | null;

    while ((limitMatch = limitPattern.exec(impuritiesBlock)) !== null) {
      const rawLabel = limitMatch[1].trim();
      limitStarts.push({
        label: `LIMIT OF ${rawLabel.toUpperCase()}`,
        index: limitMatch.index
      });
    }

    const limitTestTexts: { label: string; text: string }[] = [];
    for (let i = 0; i < limitStarts.length; i++) {
      const start = limitStarts[i].index;
      const end = i + 1 < limitStarts.length
        ? limitStarts[i + 1].index
        : enantiomericIdx > -1 ? enantiomericIdx : impuritiesBlock.length;
      limitTestTexts.push({
        label: limitStarts[i].label,
        text: impuritiesBlock.slice(start, end)
      });
    }

    return {
      assayText,
      impuritiesText: organicImpuritiesText,
      limitTestTexts,
      enantiomericPurityText,
      specificTestsText,
      additionalRequirementsText
    };
  }

  private extractSpecificTests(specificTestsText: string): ImpuritiesSpecificTest[] {
    if (!specificTestsText?.trim()) {
      return [];
    }

    const tests: ImpuritiesSpecificTest[] = [];

    // Normalize whitespace (handles single-line PDFs)
    const text = specificTestsText.replace(/\s+/g, ' ').trim();

    // Build heading regex from named parts

    const testNameAlternatives = [
      'Completeness\\s+of\\s+Solution',
      'Water\\s+(?:Determination|Content)',
      'Loss\\s+on\\s+Drying',
      'Residue\\s+on\\s+Ignition',
      'Sulfated\\s+Ash',
      'Heavy\\s+Metals',
      'Organic\\s+Volatile\\s+Impurities',
      'Particle\\s+Size',
      'Optical\\s+Rotation',
      'Melting\\s+(?:Point|Range)',
      'Conductivity',
      'Clarity\\s+of\\s+Solution',
      'Color\\s+of\\s+Solution',
      'Crystallinity',
      'Solubility',
      'Viscosity',
      'Density',
      'Refractive\\s+Index',
      'pH[Ll1Ii]?',
      'Limit\\s+of\\s+[A-Za-z][A-Za-z\\s,]+?(?=\\s*(?:\\d{3}|<\\d+>|\\(\\d+\\)|\\.| Sample|Acceptance|Instrumental|•|$))',
    ].join('|');

    const subProcedure = '(?:\\s*[—\\-]\\s*[A-Za-z\\s]+)?';
    const chapter = `(?:\\s*(?:<(\\d{3,4})>|\\((\\d{3,4})\\)|(\\d{3,4})))?`;
    const methodSuffix = '(?:[,\\s]+Method\\s+[A-Za-z0-9,\\s]+?)?';
    const inlineAcceptance = '(?:\\s*:\\s*([^•\\n]+))?';
    const lookahead = '(?=\\s*(?:Sample|Test\\s+solution|Analysis|Procedure|Instrumental|Acceptance|Meets|•|$))';

    const testHeadingPattern = new RegExp(
      `(?:•\\s*)?\\b(${testNameAlternatives})\\b` +
      subProcedure +
      chapter +
      methodSuffix +
      inlineAcceptance +
      lookahead,
      'gi'
    );

    // Collect all headings with positions

    const headings: {
      testType: string;
      uspChapter: string;
      inlineAcceptance: string;
      index: number;
    }[] = [];

    let headingMatch: RegExpExecArray | null;
    while ((headingMatch = testHeadingPattern.exec(text)) !== null) {
      const testType = headingMatch[1].trim();
      headings.push({
        testType,
        uspChapter: headingMatch[2] || headingMatch[3] || headingMatch[4] || '',
        inlineAcceptance: (headingMatch[5] || '').trim(),
        index: headingMatch.index
      });
    }

    if (headings.length === 0) {
      return tests;
    }

    // Extract fields from each block

    for (let i = 0; i < headings.length; i++) {
      const blockStart = headings[i].index;
      const blockEnd = i + 1 < headings.length
        ? headings[i + 1].index
        : text.length;

      const block = text.substring(blockStart, blockEnd).trim();

      const { testType, uspChapter, inlineAcceptance } = headings[i];

      // 1. testType label
      const testTypeLabel = uspChapter
        ? `USP ${testType} (${uspChapter})`
        : `USP ${testType}`;

      // 2. Analysis
      let analysis = '';
      const analysisMatch = block.match(
        /(?:Analysis|Procedure)[:\s]+([\s\S]+?)(?=\s*(?:Acceptance\s+criteria|Instrumental\s+conditions|(?<![a-z])•|\s*$))/im
      );

      if (analysisMatch) {
        analysis = analysisMatch[1].trim();
      }

      // 3. Sample solution
      let sampleSolution = '';
      let otherDescription = '';

      const sampleSolutionMatch = block.match(
        /(?:Sample\s+(?:solution|preparation)|Test\s+solution)[:\s]+(.+?)(?=\s*(?:Instrumental\s+conditions|Acceptance\s+criteria|Analysis[:\s]|Procedure[:\s]|Mode:|$))/i
      );
      if (sampleSolutionMatch) {
        sampleSolution = sampleSolutionMatch[1].trim();
      }

      const sampleOnlyMatch = block.match(
        /\bSample\s*:\s*((?!Solution)[\w\s,]+?)(?=\s*(?:Ratio|Acceptance\s+criteria|Analysis[:\s]|Procedure[:\s]|Sample\s+solution|•|$))/i
      );
      const sampleValue = sampleOnlyMatch ? sampleOnlyMatch[1].trim() : '';

      // 4. Acceptance criteria — use last match to skip embedded table headers
      let acceptanceCriteria = '';
      const allAcceptanceMatches = [...block.matchAll(
        /Acceptance\s+criteria[:\s]+([\s\S]+?)(?=\s*(?:•|Sample\s+solution|Analysis[:\s]|$))/gi
      )];
      if (allAcceptanceMatches.length > 0) {
        acceptanceCriteria = allAcceptanceMatches[allAcceptanceMatches.length - 1][1].trim();
      } else if (inlineAcceptance) {
        acceptanceCriteria = inlineAcceptance;
      } else if (/:\s*Meets\s+the\s+requirements/i.test(block)) {
        acceptanceCriteria = 'Meets the requirements';
      }

      // Only expand table references when "See Table" is explicitly present
      if (/see\s+table/i.test(block)) {
        const searchWindow = text.substring(
          headings[i].index,
          i + 1 < headings.length ? headings[i + 1].index : text.length
        );
        acceptanceCriteria = this.expandTableAcceptance(acceptanceCriteria, text) || acceptanceCriteria;
      }

      // 5. Other description (instrumental block)
      const instrumentalMatch = block.match(
        /(?:Instrumental\s+conditions\s+)?(?:Mode|Detector|Analytical\s+wavelength|Cell|Blank|Flow\s+rate|Column|Injection\s+volume)[:\s].+?(?=\s*(?:Acceptance\s+criteria|Sample\s+solution|Analysis[:\s]|•|$))/i
      );
      if (instrumentalMatch) {
        const instrumentalText = instrumentalMatch[0].trim();
        if (!analysis.includes(instrumentalText.substring(0, 20))) {
          otherDescription = instrumentalText;
        }
      }

      // Loss on Drying: override otherDescription with Sample value
      if (/loss\s+on\s+drying/i.test(block) && sampleValue) {
        otherDescription = `Sample: ${sampleValue}`;
      }

      // 6. Comments
      const commentParts: string[] = [];
      const noteMatch = block.match(/\[?NOTE[—:\-]\s*([^\].]+[.\]]?)/i);
      if (noteMatch) commentParts.push(noteMatch[1].trim());
      const comments = commentParts.join(' ').trim();

      tests.push({
        testType: testTypeLabel,
        sampleSolution,
        analysis,
        acceptanceCriteria,
        otherDescription,
        comments
      });

    }

    return tests;
  }

  expandTableAcceptance(acceptanceCriteria: string, fullText: string): string {
    if (!/See\s+Table/i.test(acceptanceCriteria)) return acceptanceCriteria;

    // Find the ratio block anywhere in full text
    const tableBlock = fullText.match(
      /Ratio\s+of\s+[A-Za-z]+:[A-Za-z\s]+?((?:\d+:\d+[\d.]*\s*)+).*?((?:[\d.]+-[\d.]+\s*)+)/i
    );

    if (!tableBlock) return acceptanceCriteria;

    // Extract ratio keys: ["1:2", "1:1.8"]
    const ratios = [...tableBlock[1].matchAll(/(\d+:[\d.]+)/g)].map(m => m[1]);

    // Extract range values: ["2.0-4.0", "6.0-7.3"]
    const values = [...tableBlock[2].matchAll(/([\d.]+-[\d.]+)/g)].map(m => m[1]);

    if (ratios.length === 0 || values.length === 0) return acceptanceCriteria;

    return ratios.map((r, i) => `Ratio ${r}: ${values[i] ?? ''}`.trim()).join('; ');
  }

  private getSpecificTestsSection(
    fullText: string,
    specificIdx: number,
    additionalIdx: number
  ): string {
    if (specificIdx === -1) {
      return '';  // SPECIFIC TESTS section not found
    }

    // Determine where SPECIFIC TESTS section ends
    // It ends at ADDITIONAL REQUIREMENTS or other major sections
    const endMarkers = [
      { name: 'ADDITIONAL REQUIREMENTS', index: additionalIdx },
      { name: 'ASSAY', index: fullText.substring(specificIdx + 14).search(/\bASSAY\b/i) },
      { name: 'IMPURITIES', index: fullText.substring(specificIdx + 14).search(/\bIMPURITIES\b/i) },
      { name: 'STORAGE', index: fullText.substring(specificIdx + 14).search(/\bSTORAGE\b/i) },
      { name: 'LABELING', index: fullText.substring(specificIdx + 14).search(/\bLABELING\b/i) },
      { name: 'USP REFERENCE', index: fullText.substring(specificIdx + 14).search(/\bUSP\s+REFERENCE\s+STANDARDS\b/i) },
    ];

    let endIdx = fullText.length;

    for (const marker of endMarkers) {
      if (marker.index > -1) {
        const absoluteIdx = specificIdx + 14 + marker.index;
        if (absoluteIdx > specificIdx && absoluteIdx < endIdx) {
          endIdx = absoluteIdx;
        }
      }
    }

    // If ADDITIONAL REQUIREMENTS was found and is closer, use it
    if (additionalIdx > specificIdx && additionalIdx < endIdx) {
      endIdx = additionalIdx;
    }

    return fullText.slice(specificIdx, endIdx).trim();
  }


  private extractReferenceStandards(
    additionalRequirementsText: string
  ): ImpuritiesAdditionalRequirements | null {

    if (!additionalRequirementsText?.trim()) {
      return null;
    }

    try {
      // Hard-stop at "Auxiliary Information"
      // Defensive second guard in case the caller passes unclipped text.
      const auxIdx = additionalRequirementsText.search(/\bAuxiliary\s+Information\b/i);
      const safeText = (auxIdx > -1
        ? additionalRequirementsText.slice(0, auxIdx)
        : additionalRequirementsText
      ).trim();

      if (!safeText) return null;

      // Isolate the USP Reference Standards subsection
      // Matches "• USP REFERENCE STANDARDS ⟨11⟩" with optional bracket variants
      // Stops at the next bullet section or end of safe text
      const refStdSectionPattern =
        /•?\s*USP\s+REFERENCE\s+STANDARDS?\s*[<〈]?\s*11\s*[>〉]?\s*\.?\n?([\s\S]*?)(?=\n\s*•\s*[A-Z]|$)/i;

      const sectionMatch = safeText.match(refStdSectionPattern);
      const refStdBlock = sectionMatch?.[1]?.trim() ?? '';

      if (!refStdBlock) return null;

      // Clean OCR artifacts before splitting
      const cleanedBlock = refStdBlock
        .replace(/\r\n|\r/g, '\n')                      // normalize line endings
        .replace(/[^\x20-\x7E\n]/g, ' ')                // strip non-ASCII junk
        .replace(/[!@#$%^&*()]{1,4}\s*SP\b/gi, 'USP')  // fix OCR-corrupted "USP"
        .replace(/\b0SP\b/gi, 'USP')                    // fix "0SP" → "USP"
        .replace(/\s*\n\s*/g, ' ')                      // flatten to single line
        .replace(/\s{2,}/g, ' ')                        // collapse extra spaces
        .trim();

      // Split on "USP RS" boundaries
      // Lookahead keeps the "USP" delimiter at the start of each part
      const parts = cleanedBlock
        .split(/(?=\bUSP\s+[\w][\w\s]*?\bRS\b)/i)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (parts.length === 0) return null;

      // Format each entry
      // Pattern: "USP <Name> RS" followed optionally by chemical description
      const rsNamePattern = /^(USP\s+[\w][\w\s]*?\bRS\b)\s*(.*)?$/i;

      const entries: string[] = [];
      for (const part of parts) {
        const m = part.match(rsNamePattern);
        if (!m) continue;

        const rsName = m[1].trim();
        const rsDetails = (m[2] ?? '').trim();

        entries.push(rsDetails ? `${rsName} — ${rsDetails}` : rsName);
      }

      if (entries.length === 0) return null;

      // Map to ImpuritiesAdditionalRequirements
      return {
        referenceStandards: entries.join('; ')
      };

    } catch (error) {
      console.error('[extractReferenceStandards] Extraction failed:', error);
      return null;
    }
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

    // ── Pre-fix: pH stray-letter cleanup (run early, before any rule can interact) ──
    text = text.replace(/pH[Ll1Ii]/g, 'pH');

    // Pre-fix: Structural character fixes
    text = text.replace(/\{/g, '(').replace(/\}/g, ')');
    text = text.replace(/Com[Pp]-?\s*ound/gi, 'Compound');

    // Fix 1: Heal garbled "USP <name> RS" zones
    text = text.replace(
      /\bUSP\s+[\w\s\d\-]+?[\s\-]*\bRS\b/gi,
      (zone: string) => {
        let inner = zone
          .replace(/^USP\s+/i, '')
          .replace(/[\s\-]*\bRS\s*$/i, '')
          .trim();
        const relMatch = /\bRelated\b/i.exec(inner);
        if (relMatch) {
          const substancePart = inner.substring(0, relMatch.index).trim();
          const relatedSuffix = inner.substring(relMatch.index).trim();
          const collapsed = substancePart.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const target = substanceName.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const fixed = this.lcsSimilarity(collapsed, target) >= 0.65
            ? substanceName : substancePart;
          return `USP ${fixed} ${relatedSuffix} RS`;
        } else {
          const collapsed = inner.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const target = substanceName.replace(/[^a-zA-Z]/g, '').toLowerCase();
          return this.lcsSimilarity(collapsed, target) >= 0.65
            ? `USP ${substanceName} RS` : zone;
        }
      }
    );

    // Fix 2: "[NorE" / "NorE" → "Note"
    text = text.replace(/\[NorE/g, '[Note');
    text = text.replace(/\bNorE\b/g, 'Note');

    // Fix 3: "lnject" → "Inject"
    text = text.replace(/\blnject/g, 'Inject');

    // Fix 4: "1 H-" → "1H-"
    text = text.replace(/(\d)\s+\b(H-)/g, '$1$2');

    // Fix 5: Spaces inside ratio parentheses
    text = text.replace(/\(\s*(\d+)\s*:\s*(\d+)\s*\)/g, '($1:$2)');
    text = text.replace(/\(\s*(\d+)\s*:\s*(\d+)\s*:\s*(\d+)\s*\)/g, '($1:$2:$3)');

    // Fix 6: OCR-truncated "Sensitivity solution:"
    text = text.replace(/(?<!\w)ion\s*:/g, 'Sensitivity solution:');

    // Fix 7: NLT / NMT normalization
    text = text.replace(/\bN[lL][tT]\b/g, 'NLT');
    text = text.replace(/\bN[mM][tT]\b/g, 'NMT');

    // Fix 8: Remove USP effective date annotations
    text = text.replace(
      /\(\s*(?:ERR|eff|CN|eff\.?)\s*[\d,\s\-A-Za-z]*\d{4}\s*\)/gi, ''
    );

    // Fix 9: Collapse spaced digits in molecular formula
    text = text.replace(/\(([^)]+)\)/g, (_, inner) =>
      '(' + inner.replace(/([A-Z])\s+(\d+)/g, '$1$2') + ')'
    );

    // Fix 9b: Collapse spaced digits in N-notation (outside parentheses)
    text = text.replace(/\b([A-Z])\s+(\d+)\s*/g, '$1$2');

    // Fix 9c: Clean up spacing around commas in chemical notation
    text = text.replace(/(\w)\s+,\s*/g, '$1,');

    // Fix 10: Normalize analysis variable capitalization
    text = text.replace(/\bRu\b/g, 'ru');
    text = text.replace(/\bRs\b/g, 'rs');
    text = text.replace(/\bCu\b(?!\s*RS\b)/g, 'Cu');
    text = text.replace(/\bCs\b/g, 'Cs');

    // Fix 11: OCR digit-5 for letter-s in variable names
    text = text.replace(/\br5\s*=/g, 'rs =');
    text = text.replace(/\bC5\s*=/g, 'Cs =');
    text = text.replace(/\/r5\s*\)/g, '/rs)');
    text = text.replace(/\bC5\s*\/\s*Cu/g, 'Cs/Cu');
    text = text.replace(/\bCs\s*\/\s*C5/g, 'Cs/Cu');

    // Fix 12: "HCI" → "HCl"
    text = text.replace(/\bHCI\b/g, 'HCl');

    // Fix 13: Normalize spaced variable names
    text = text.replace(/\br\s+u\b/gi, 'ru');
    text = text.replace(/\br\s+s\b/gi, 'rs');
    text = text.replace(/\bC\s+s\b/g, 'Cs');
    text = text.replace(/\bC\s+u\b/g, 'Cu');

    // Fix 14: Normalize parenthesized variable expressions
    text = text.replace(/\(\s*ru\s*\/\s*rs\s*\)/gi, '(ru/rs)');
    text = text.replace(/\(\s*Cs\s*\/\s*Cu\s*\)/gi, '(Cs/Cu)');

    // Fix 15: Normalize molecular weight variable names
    text = text.replace(/\bM[,_]\s*1\s*=/g, 'Mr1 =');
    text = text.replace(/\bM[,_]\s*2\s*=/g, 'Mr2 =');
    text = text.replace(/\bM\s+r\s*1\s*=/g, 'Mr1 =');
    text = text.replace(/\bM\s+r\s*2\s*=/g, 'Mr2 =');
    text = text.replace(/\bM[_,]{1,2}\s*=/g, 'Mr1 =');
    text = text.replace(/\bM[_,]{2,}\s*=/g, 'Mr2 =');
    let mr1Count = 0;
    text = text.replace(/\bMr1\s*=/g, () => {
      mr1Count++;
      return mr1Count === 1 ? 'Mr1 =' : 'Mr2 =';
    });

    // Fix 16: Clean OCR substance name artifacts
    text = text.replace(/H:,,dralazine/gi, 'Hydralazine');
    text = text.replace(/H:,,drochloride/gi, 'Hydrochloride');
    text = text.replace(/([A-Z]):,,([a-z])/g, '$1y$2');

    // Fix 17: USP font "p" encoded as "12" or "P-"
    text = text.replace(/(\w)12(\w)/g, '$1p$2');

    // Fix 18: USP font specific substance name variants
    text = text.replace(/Omew\s*azole/gi, 'Omeprazole');
    text = text.replace(/Omegrazole/gi, 'Omeprazole');
    text = text.replace(/Omei;irazole/gi, 'Omeprazole');
    text = text.replace(/Comi;iound/gi, 'Compound');
    text = text.replace(/Ome\s+P-razole/gi, 'Omeprazole');
    text = text.replace(/Ome\s+razole/gi, 'Omeprazole');

    // Fix 19: Garbled method/instrument names
    text = text.replace(/S12ectrosco12y_?/gi, 'Spectroscopy');
    text = text.replace(/Chromatogra[\w.\]]*hy_?/gi, 'Chromatography');
    text = text.replace(/Chromatog[@\w]*i;ihic/gi, 'Chromatographic');
    text = text.replace(/[~]?xstem\s+Suitabilit[xy]/gi, 'System Suitability');
    text = text.replace(/Suitabilit[xy]\b/gi, 'Suitability');

    // Fix 20: Garbled sulfinyl/sulfonyl
    text = text.replace(/sulfl\s*nyl/gi, 'sulfinyl');
    text = text.replace(/sulf\s*myl/gi, 'sulfonyl');

    // Fix 21: Strip OCR garbage blocks
    /* text = text.replace(
       /(?:(?:[^\w\s]|[A-Z0-9])\s){4,}(?:[^\w\s]|[A-Z0-9])/g, ''
     );
     */

    // Fix 21: Strip OCR garbage blocks
    text = text.replace(
      /(?:(?:[^\w\s]|[A-Z0-9])\s){8,}(?:[^\w\s]|[A-Z0-9])/g, ''
    );

    // ── Fix 22: Remove Unicode replacement characters and unmapped glyphs ─────
    text = text.replace(/\uFFFD/g, '');
    text = text.replace(
      /[^\x09\x0A\x0D\x20-\x7E\u00A0-\u024F\u0370-\u03FF\u2000-\u206F\u2200-\u22FF\u03BC]/g,
      ''
    );

    // Fix 23a: Restore missing "Analysis" heading
    text = text.replace(
      /\b((?:NMT|NLT)\s+[\d.]+%?[^.]*?)\s+(Samples?\s*:\s*(?:Standard|Sample|System))/gi,
      (full, before, after) => {
        if (!/\bAnalysis\b/i.test(before)) {
          return before + ' Analysis ' + after;
        }
        return full;
      }
    );

    // Fix 23b: Restore missing Result formula consumed by OCR garbage
    text = text.replace(
      /(\bAnalysis\b\s*Samples?[^=]+?taken:\s*)(ru\s*=)/is,
      (full, before, after) => {
        if (!/Result\s*=/i.test(before)) {
          const hasF = /\bF\s*=\s*/i.test(full);
          const hasMr = /\bMr1\b|\bMr2\b/i.test(full);
          const formula = hasMr
            ? '(ru/rs) x (Cs/Cu) x (Mr1/Mr2) x 100 '
            : hasF
              ? '(ru/rs) x (Cs/Cu) x (1/F) x 100 '
              : '(ru/rs) x (Cs/Cu) x 100 ';
          return before + formula + after;
        }
        return full;
      }
    );

    // Fix 25: Strip EP page break artifacts
    text = text.replace(
      /General\s+Notices\s+apply\s+to\s+all\s+monographs[\s\S]*?See\s+the\s+information\s+on\s+general\s+monographs\s+\d+/gi,
      ''
    );

    // Fix 26: Strip EP page header repetitions
    text = text.replace(
      /EUROPEAN\s+PHARMACOPOEIA\s+[\d/:.]+\s+[A-Z][a-zA-Z\s]{2,50}(?=\s+(?:Test\s+solution|Reference\s+solution|Column|Mobile\s+phase|Flow\s+rate|Detection|Injection|System\s+[Ss]uitability|Limits|Relative\s+retention|Calculation|Loss|Sulfated|Water\s+\())/gi,
      ''
    );

    // Fix 27: Fix units
    text = text.replace(/\b(\d+(?:\.\d+)?)\s*mg\/ml\b/g, '$1 mg/mL');
    text = text.replace(/\b(\d+(?:\.\d+)?)\s*µg\/ml\b/g, '$1 µg/mL');
    text = text.replace(/\b(\d+(?:\.\d+)?)\s*μg\/ml\b/g, '$1 μg/mL');
    text = text.replace(/\bmg\/ml\b/g, 'mg/mL');
    text = text.replace(/\bµg\/ml\b/g, 'µg/mL');
    text = text.replace(/\bμg\/ml\b/g, 'μg/mL');
    text = text.replace(/\bmL\/min\b/gi, 'mL/min');

    // Fix 28: Normalize SPECIFIC TESTS section headings
    // Fix: Water Determination OCR artifacts
    text = text.replace(
      /\bWATER\s+DETERMINATION\s*(\d{3,4})\s*\./gi,
      'Water Determination ($1)'
    );
    text = text.replace(/\bMethod\s+Jc\b/g, 'Method Ic');
    text = text.replace(/\b(NMT|NLT)(\d)/g, '$1 $2');

    text = text.replace(/\bCR[yv]s?[tT][aA][lL][lL][iI1][nN][iI1][tT][yY]\b/gi, 'Crystallinity');
    text = text.replace(
      /\bCR[yv]s?[tT][aA][lL]{1,2}[iI1][nN][iI1]?[rRtT]{0,2}[vVyY]\b/gi,
      'Crystallinity'
    );
    text = text.replace(/(Crystallinity\s*\()\s*2(\d{2}\s*\))/gi, '$1' + '6' + '$2');
    text = text.replace(/\bCrystallinity\s+2(\d{2})\s*:/gi, 'Crystallinity (6$1):');
    text = text.replace(/(Crystallinity\s*\()\s*2(\d{2}\s*\))/gi, '$16$2');

    // Fix 28b: pH normalization
    // Belt-and-suspenders repeat of the pre-fix, catches any pHL re-introduced
    // by earlier rules (e.g. Fix 17 p-encoding, Fix 16 artifact repair)
    text = text.replace(/pH[Ll1Ii]/g, 'pH');

    // Fix: stray space-period after chapter numbers "791 ." → "791"
    text = text.replace(/\b(\d{3,4})\s+\./g, '$1');

    // Fix: pH OCR symbol variants — runs AFTER pHL cleanup
    text = text.replace(/\bfl[:\-!._]+\b/g, 'pH');
    text = text.replace(/\bp[Hh4]\b/g, 'pH');

    // Optical Rotation — mixed case OCR variants
    text = text.replace(/\bOPT[iI1][cC][aA][lL]\s+ROT[aA][tT][iI1][oO0][nN]\b/gi, 'Optical Rotation');

    // "snecific" → "specific" (OCR p→n swap)
    text = text.replace(/\bsnecific\b/gi, 'specific');

    // Stray OCR symbols between real words
    text = text.replace(/\bS\s*~\s*/g, '');
    text = text.replace(/[~§©®]\s*/g, ' ');

    // ── Fix 29: Collapse whitespace
    return text.replace(/\s+/g, ' ').trim();
  }

  private lcsSimilarity(a: string, b: string): number {

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

    const match = text.match(
      /Official\s+Date:\s*([\w\s]+?)\s+as\s+of\s+(\d{2}-\w{3}-\d{4})/i
    );

    if (match) {
      const rawDate = match[2].replace(/[^\x20-\x7E]/g, '').trim();
      const parts = rawDate.split('-');
      const day = parts[0]?.trim();
      const monthStr = parts[1]?.trim();
      const year = parts[2]?.trim();

      const monthAbbrevs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthMap: { [key: string]: string } = {
        jan: '01', feb: '02', mar: '03', apr: '04',
        may: '05', jun: '06', jul: '07', aug: '08',
        sep: '09', oct: '10', nov: '11', dec: '12',
        deo: '12', oet: '10', oot: '10', aue: '08', atig: '08'
      };

      const monthStr3 = monthStr?.toLowerCase().slice(0, 3) ?? '';
      let month = monthMap[monthStr3] ?? '00';

      if (month === '00') {
        const candidates = monthAbbrevs.filter(m => m[0] === monthStr3[0]);
        if (candidates.length === 1) {
          month = String(monthAbbrevs.indexOf(candidates[0]) + 1).padStart(2, '0');
        }
      }

      const formattedDate = `${month}/${day}/${year}`;

      return {
        dateType: match[1].trim(),
        dateTypeDate: formattedDate
      };
    }

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
    // Converts "DD-Mon-YYYY" or "DD Mon YYYY" to "MM/DD/YYYY"
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

    const titleMatch = text.match(
      /USP-NF\s+([A-Z][A-Za-z0-9\s\-]+?)(?=\s+(?:Printed|©|\d{1,2}\/\d{1,2}\/\d{2,4}|$))/i
    );
    if (titleMatch) {
      const candidate = titleMatch[1].trim();
      if (candidate.length > 1 && candidate.length < 80) {
        return candidate;
      }
    }

    // Zone between "Do not distribute" and "DEFINITION"
    const anchorIdx = text.toLowerCase().indexOf('do not distribute');
    const defIdx = text.toLowerCase().indexOf('definition');

    if (anchorIdx !== -1 && defIdx !== -1) {
      const zone = text.substring(anchorIdx + 'do not distribute'.length, defIdx);
      const tokens = zone.split(/\s+/);
      const nameTokens: string[] = [];

      const validToken = /^[A-Z][a-zA-Z]{1,}$/;
      const noisePattern = /^[+\-\d©]|[,\(\)\[\]\/\\°%*]|^[A-Z]{2,}\d|^C\d+H|^[a-z]{1,2}-/;
      const skipPhrases = /^(Add|the|following)$/i;

      for (const token of tokens) {
        if (skipPhrases.test(token)) continue;
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

    // Title Case phrase before DEFINITION
    const beforeDef = defIdx !== -1 ? text.substring(0, defIdx) : text;
    const fallback = beforeDef.match(/\n([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,4})\n/);
    return fallback ? fallback[1].trim() : '';
  }


  // Map to Test Section - Tests
  async mapToTest(
    testLabel: string,
    sectionText: string,
    assayText: string,
    source: string,
    sourceType: string,
    sourceId: string,
  ): Promise<ImpuritiesTesting> {

    const buffer = this.extractBuffer(sectionText);

    const diluent = this.detectDiluent(sectionText, assayText);

    // extract Solutions
    const solutions = this.extractStandardSystemSolutions(sectionText, assayText);

    const systemSuitabilitySolution = solutions['systemSuitabilitySolution'];
    const systemSuitabilityStockSolution = solutions['systemSuitabilityStockSolution'];
    const standardSolution = solutions['standardSolution'];
    const standardStockSolution = solutions['standardStockSolution'];
    const sampleSolution = solutions['sampleSolution'];
    const sampleStockSolution = solutions['sampleStockSolution'];
    const sensitivitySolution = solutions['sensitivitySolution'];

    // extract System Suitability
    const systemSuitabilitySample = this.detectSystemSuitabilitySample(sectionText, testLabel);

    const suitabilityReq = this.detectSuitabilityRequirements(sectionText, testLabel);

    const suitabilityReqResolution = suitabilityReq['suitabilityReqResolution'];
    const systemSuitabilityReqTailingFactor = suitabilityReq['systemSuitabilityReqTailingFactor'];
    const suitabilityReqRelStandardDeviation = suitabilityReq['suitabilityReqRelStandardDeviation'];
    const systemSuitabilitySignalToNoiseRatio = suitabilityReq['systemSuitabilitySignalToNoiseRatio'];

    // extract Analysis List
    const analysisData = this.extractAnalysisList(sectionText, testLabel);

    const impuritiesAnalysisList = [{
      samples: analysisData['samples'],
      description: analysisData['description'],
      resultFormula: analysisData['resultFormula'],
      formulaRU: analysisData['formulaRU'],
      formulaRS: analysisData['formulaRS'],
      formulaCS: analysisData['formulaCS'],
      formulaCU: analysisData['formulaCU'],
      formulaF: analysisData['formulaF'],
      formulaP: analysisData['formulaP'],
      formulaMR1: analysisData['formulaMR1'],
      formulaMR2: analysisData['formulaMR2'],
    }];

    // Chromatographic parameters
    const wavelengthMatch = sectionText.match(/UV\s*(\d{3})\s*nm/i);

    // Detector Wave Length
    const detectorWavelength = wavelengthMatch ? `${wavelengthMatch[1]} nm` : '';

    //const columnMatch = sectionText.match(
    //  /(\d+[.\s][O0]\d*[-–]\s*mm\s*[×xX]\s*\d+[-–]\s*cm)/i
    //);

    const columnMatch = sectionText.match(
      /([\d.]+[-–]mm\s*[xX×]\s*[\d.]+[-–]cm)/i
    );

    const columnSize = columnMatch
      ? columnMatch[1]
        .replace(/\s/g, '')
        .replace(/[xX×]/g, ' × ')
        .replace(/mm\s*×/, 'mm ×')
      : '';

    // Column Package Size
    const packingSizeMatch = sectionText.match(/(\d+(?:\.\d+)?)\s*[-–]?\s*[μu]m\s*packing/i);
    const columnPackingSize = packingSizeMatch ? `${packingSizeMatch[1]}-μm packing` : '';

    const packingTypeMatch = sectionText.match(/packing\s+([Ll]\s*\d+)/i);
    const columnPackingType = packingTypeMatch
      ? packingTypeMatch[1].replace(/\s/g, '').toUpperCase()
      : '';

    const flowMatch = sectionText.match(/([\d.]+\s*mL\/min)/i);
    const flowRate = flowMatch ? flowMatch[1] : '';

    const injMatch = sectionText.match(/([\d.]+\s*[µu]L)/i);
    const injectionVolumeAmount = injMatch ?
      injMatch[1] : '';

    const tempMatch = sectionText.match(/[Aa]utosampler\s+temperature[:\s]*([\d°\s]+)/i);
    const autosamplerTemperature = tempMatch ? tempMatch[1].trim() : undefined;

    // extract Impurities Solution related to Mobile Pahse
    const impuritiesSolutionList = this.extractSolution(sectionText);

    // extract Solution Table or Mobile Phase
    const impuritiesSolutionTableList = this.extractSolutionTable(sectionText);
    const elutionType = impuritiesSolutionTableList.length > 0
      ? 'GRADIENT'
      : 'ISOCRATIC';

    // extract Impurities Details  
    let impuritiesDetailsList: ImpuritiesDetails[] = [];

    if (testLabel && testLabel === 'ORGANIC IMPURITIES') {
      impuritiesDetailsList = await this.extractImpurityDetails(sectionText);
    }

    // extract Unspecified Impurities
    const impuritiesUnspecifiedList = this.extractUnspecified(sectionText);

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
      systemSuitabilityStockSolution,
      standardSolution,
      standardStockSolution,
      sampleSolution,
      sampleStockSolution,
      ...(sensitivitySolution ? { sensitivitySolution } : {}),
      systemSuitabilitySample,
      ...(suitabilityReqRelStandardDeviation ? { suitabilityReqRelStandardDeviation } : {}),
      ...(systemSuitabilityReqTailingFactor ? { systemSuitabilityReqTailingFactor } : {}),
      ...(suitabilityReqResolution ? { suitabilityReqResolution } : {}),
      ...(systemSuitabilitySignalToNoiseRatio ? { systemSuitabilitySignalToNoiseRatio } : {}),
      impuritiesSolutionList,
      impuritiesSolutionTableList,
      impuritiesAnalysisList,
      impuritiesDetailsList,
      impuritiesUnspecifiedList,
    };
  }

  private extractAssayLimits(text: string): { assayLow: number; assayHigh: number; unit: string } {

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
    //  Plain numeric range in Acceptance criteria (no unit inline)
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

  private extractBuffer(text: string): string {
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
      'is'
    );

    const match = text.match(bufferPattern);

    if (match) {
      const cleaned = this.cleanOcrArtifacts(match[1]);

      return cleaned.replace(/\bml\b/g, 'mL');
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

    const crossRefPattern = /(?:Mobile\s+phase\s*,\s*)?Diluent\s*,?\s*(?:and\s+[\w\s]+)?:\s*(?:Prepare|Proceed)\s+as\s+directed\s+in\s+(?:the\s+)?\w+/i;

    if (crossRefPattern.test(sectionText) && assayText) {
      const assayMatch = assayText.match(diluentPattern);
      if (assayMatch) {
        return this.cleanOcrArtifacts(assayMatch[1]);
      }
      return '';
    }

    // Direct "Diluent:" declaration
    const match = sectionText.match(diluentPattern);
    if (match) {
      return this.cleanOcrArtifacts(match[1]);
    }

    return '';
  }

  private extractStandardSystemSolutions(sectionText: string, assayText?: string): { [key: string]: string } {

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

    const term = (...exclude: string[]): string => {
      const patterns = Object.entries(T)
        .filter(([k]) => !exclude.includes(k))
        .map(([, v]) => v);
      return `(?=\\s*(?:${patterns.join('|')})\\s*(?:[,:(]|\\s+(?:Mode|Detector|Column|Flow)))`;
    };

    const getField = (text: string, anchor: string, terminator: string): string => {
      const pattern = new RegExp(`${anchor}:\\s*(.+?)${terminator}`, 'is');
      const match = text.match(pattern);
      return match ? match[1].replace(/\s+/g, ' ').trim() : '';
    };

    const crossRef = /^(?:Prepare|Proceed)\s+as\s+directed\s+in\s+(?:the\s+)?\w+/i;

    const resolve = (anchor: string, terminator: string): string => {
      let val = getField(sectionText, anchor, terminator);
      if (val && crossRef.test(val) && assayText) {
        val = getField(assayText, anchor, terminator);
      }
      return val;
    };

    // Stock-specific terminator: stops at the non-stock version of the same label
    // by using a hard-coded lookahead that does NOT include the stock variant
    const stockTerm = (nonStockAnchor: string, ...exclude: string[]): string => {
      const patterns = Object.entries(T)
        .filter(([k]) => !exclude.includes(k))
        .map(([, v]) => v);
      return `(?=\\s*(?:${nonStockAnchor}|${patterns.join('|')})\\s*(?:[,:(]|\\s+(?:Mode|Detector|Column|Flow)))`;
    };

    return {
      standardSolution: resolve(
        `(?<![Ss]tock\\s)Standard\\s+solution`,
        term('standard')
      ),
      systemSuitabilitySolution: resolve(
        `(?<![Ss]tock\\s)System\\s+suitability\\s+solution`,
        term('syssuit')
      ),
      sampleSolution: resolve(
        `(?<![Ss]tock\\s)Sample\\s+solution`,
        term('sample')
      ),
      sensitivitySolution: resolve(
        `Sensitivity\\s+solution`,
        term('sensitivity')
      ),
      systemSuitabilityStockSolution: resolve(
        `System\\s+suitability\\s+stock\\s+solution`,
        stockTerm(
          `System\\s+suitability\\s+solution(?!\\s+stock)`,
          'syssuit'
        )
      ),
      standardStockSolution: resolve(
        `Standard\\s+stock\\s+solution`,
        stockTerm(
          `Standard\\s+solution(?!\\s+stock)`,
          'standard'
        )
      ),
      sampleStockSolution: resolve(
        `Sample\\s+stock\\s+solution`,
        stockTerm(
          `Sample\\s+solution(?!\\s+stock)`,
          'sample'
        )
      ),
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

    const blockPattern = /Suitability\s+requirements\s*(.+?)(?=\s*(?:Analysis\b|$))/is;
    const blockMatch = sectionText.match(blockPattern);

    if (!blockMatch) {
      return {
        suitabilityReqResolution: '',
        systemSuitabilityReqTailingFactor: '',
        suitabilityReqRelStandardDeviation: '',
        systemSuitabilitySignalToNoiseRatio: '',
      };
    }

    const block = blockMatch[1];

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

    const getField = (anchor: string): string => {
      const pattern = new RegExp(`${anchor}\\s*:\\s*(.+?)${fieldTerm}`, 'is');
      const match = block.match(pattern);
      if (!match) return '';
      return match[1]
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s%.,;:()\-–×/μµ°]/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    };

    return {
      suitabilityReqResolution: getField(`Resolution`),

      systemSuitabilityReqTailingFactor: getField(`Tailing\\s+factor`),

      // Reads directly from the block using a line-aware pattern
      // Matches: "NMT 0.73%, Standard solution"
      // The % and trailing solution label are captured explicitly
      suitabilityReqRelStandardDeviation: (() => {
        const pattern = new RegExp(
          `Relative\\s+standard\\s+deviation\\s*:\\s*` +
          `(NMT\\s+[\\d.]+%` +                                           // e.g. "NMT 0.73%"
          `(?:,\\s*(?:Standard|System\\s+suitability|Sample|Sensitivity)\\s+solution)?` +  // e.g. ", Standard solution"
          `)`,
          'i'
        );
        const m = block.match(pattern);
        if (!m) {
          // Fallback: % may be missing due to OCR — capture without it
          const fallback = new RegExp(
            `Relative\\s+standard\\s+deviation\\s*:\\s*` +
            `(NMT\\s+[\\d.]+` +
            `(?:%)?` +
            `(?:,\\s*(?:Standard|System\\s+suitability|Sample|Sensitivity)\\s+solution)?` +
            `)`,
            'i'
          );
          const fb = block.match(fallback);
          return fb ? fb[1].replace(/\s+/g, ' ').trim() : '';
        }
        return m[1].replace(/\s+/g, ' ').trim();
      })(),

      systemSuitabilitySignalToNoiseRatio: getField(`Signal.to.noise\\s+ratio`),
    };
  }

  private extractAnalysisList(
    sectionText: string,
    test: string
  ): { [key: string]: string } {

    let block = '';
    const blockMatch = sectionText.match(
      /\bAnalysis\b\s*(.+?)(?=\s*(?:Acceptance\s+criteria|IMPURITIES|SPECIFIC\s+TESTS|ADDITIONAL\s+REQUIREMENTS|$))/is
    );

    if (blockMatch) {
      block = blockMatch[1];
    } else {
      const fallbackMatch = sectionText.match(
        /(?:Suitability\s+requirements|standard\s+deviation|Tailing\s+factor|Resolution)[\s\S]+?((?:Samples?\s*:.+?)?(?:Calculate\s+.+?)?(?:r[us_\s]*=.+?))(?=\s*(?:Acceptance\s+criteria|IMPURITIES|SPECIFIC\s+TESTS|ADDITIONAL\s+REQUIREMENTS|$))/is
      );

      if (fallbackMatch) {
        block = fallbackMatch[1];
      } else {
        const lastSuitIdx = sectionText.search(
          /(?:NMT|NLT)\s+[\d.]+%?[^.]*?(?:Standard|System\s+suitability|Sample)\s+solution\s*$/im
        );
        if (lastSuitIdx > -1) {
          block = sectionText.slice(lastSuitIdx);
          block = block.replace(
            /^(?:NMT|NLT)\s+[\d.]+%?[^.]*?(?:Standard|System\s+suitability|Sample)\s+solution\s*/im,
            ''
          ).trim();
        }
      }
    }

    const empty = {
      samples: '',
      description: '',
      resultFormula: '',
      formulaRU: '',
      formulaRS: '',
      formulaCS: '',
      formulaCU: '',
      formulaF: '',
      formulaP: '',
      formulaMR1: '',
      formulaMR2: '',
    };
    if (!block) return empty;

    block = block.replace(
      /(?:(?:[^\w\s]|[A-Z0-9])\s){4,}(?:[^\w\s]|[A-Z0-9])/g, ''
    );

    block = block.replace(/\(([^)]+)\)/g, (_, inner) => {
      let prev = '', curr = inner;
      while (prev !== curr) {
        prev = curr;
        curr = curr.replace(/([A-Z])\s+(\d+)/g, '$1$2');
      }
      return '(' + curr + ')';
    });

    block = block.replace(/\s+/g, ' ').trim();

    const samplesMatch = block.match(
      /\bSamples?\s*:\s*(.+?)(?=\s*(?:Calculate|Result\s*=|\[?Note|r[us_\s]*=|$))/is
    );
    const samples = samplesMatch
      ? samplesMatch[1].replace(/\s+/g, ' ').trim()
      : '';

    const descMatch = block.match(
      /(Calculate\s+.+?)(?=\s*(?::\s*\([^)]+\)|Result\s*=|r[us_\s]*=|C[su]\s*=|Mr1\s*=|P\s*=|F\s*=|[A-Z][a-z]*\s*=|$))/is
    );
    const description = descMatch
      ? descMatch[1]
        .replace(/:\s*\([^)]+\)\s*x\s*\([^)]+\)\s*x\s*[\dPF\s]+$/i, '')
        .replace(/(?:(?:[^\w\s]|[A-Z0-9])\s){3,}(?:[^\w\s]|[A-Z0-9])/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      : '';

    const defaultFormulas: { [key: string]: string } = {
      'ASSAY': '(ru/rs) x (Cs/Cu) x 100',
      'IMPURITIES': '(ru/rs) x (Cs/Cu) x (1/F) x 100',
    };

    let resultFormula = '';
    const formulaMatch = block.match(
      /Result\s*=\s*(.+?)(?=\s*(?:\[?Note|r[us_\s]*=|C[su]\s*=|Mr1\s*=|P\s*=|F\s*=|[A-Za-z]+\s*=|$))/is
    );

    if (formulaMatch) {
      const val = formulaMatch[1]
        .replace(/^Result\s*=\s*/i, '')
        .replace(/(?:(?:[^\w\s()/×x.%])\s){2,}(?:[^\w\s()/×x.%])/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!val || /^[A-Za-z]{1,3}$/.test(val)) {
        const hasPotency = /\bP\s*=\s*potency\b/i.test(block);
        const hasConvFactor = /\bF\s*=\s*conversion\s+factor\b/i.test(block);
        resultFormula = (hasPotency && hasConvFactor)
          ? '(ru/rs) x (Cs/Cu) x P x F'
          : (defaultFormulas[test.toUpperCase()] ?? defaultFormulas['ASSAY']);
      } else {
        const hasF = /\bF\s*=\s*/i.test(block);
        const hasMr = /\bMr1\b|\bMr2\b/i.test(block);
        if (test.toUpperCase().includes('IMPURIT') && hasF && !val.includes('1/F')) {
          resultFormula = defaultFormulas['IMPURITIES'];
        } else if (hasMr && !val.includes('Mr')) {
          resultFormula = '(ru/rs) x (Cs/Cu) x (Mr1/Mr2) x 100';
        } else {
          resultFormula = val.replace(/^Result\s*=\s*/i, '').trim();
        }
      }
    } else {
      const hasPotency = /\bP\s*=\s*potency\b/i.test(block);
      const hasConvFactor = /\bF\s*=\s*conversion\s+factor\b/i.test(block);
      const hasF = /\bF\s*=\s*/i.test(block);
      const hasMr = /\bMr1\b|\bMr2\b/i.test(block);
      resultFormula = hasMr
        ? '(ru/rs) x (Cs/Cu) x (Mr1/Mr2) x 100'
        : (hasPotency && hasConvFactor)
          ? '(ru/rs) x (Cs/Cu) x P x F'
          : hasF && test.toUpperCase().includes('IMPURIT')
            ? defaultFormulas['IMPURITIES']
            : (defaultFormulas[test.toUpperCase()] ?? defaultFormulas['ASSAY']);
    }

    resultFormula = resultFormula.replace(/^Result\s*=\s*/i, '').trim();
    resultFormula = resultFormula.replace(/\s+x\s+/g, ' x ');

    const varPattern = /\b([A-Za-z_][A-Za-z0-9_]*|r[us_\s])\s*=\s*(.+?)(?=\s*(?:\[?Note|[A-Za-z_][A-Za-z0-9_]*\s*=|r[us_\s]\s*=|Acceptance|$))/gis;
    const vars: { [key: string]: string } = {};

    let varMatch: RegExpExecArray | null;
    while ((varMatch = varPattern.exec(block)) !== null) {
      let key = varMatch[1].trim();

      if (key === 'r_' || key === 'r ' || key === 'r') {
        const valContext = varMatch[2].toLowerCase();
        if (valContext.includes('sample')) {
          key = 'ru';
        } else if (valContext.includes('standard')) {
          key = 'rs';
        }
      }

      const val = varMatch[2]
        .replace(/(?:(?:[^\w\s()/×x.%,μµ°])\s){2,}(?:[^\w\s()/×x.%,μµ°])/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (key.toLowerCase() !== 'result' && val.length >= 1) {
        vars[key] = val;
      }
    }

    const getVar = (...keys: string[]): string => {
      for (const k of keys) {
        const found = Object.keys(vars).find(
          v => v.toLowerCase() === k.toLowerCase()
        );
        if (found && vars[found]) return vars[found];
      }
      return '';
    };

    const rawF = getVar('F');
    const formulaF = rawF.replace(/\bTable\s+\d+\b/gi, (match) => {
      const tableCount = (sectionText.match(/\bTable\s+\d+\b/gi) ?? []).length;
      return tableCount <= 2 ? 'Table 1' : match;
    });

    resultFormula = resultFormula.replace(/^(Result\s*=\s*)+/i, '').trim();

    return {
      samples,
      description,
      resultFormula,
      formulaRU: getVar('ru', 'r_u', 'r u'),
      formulaRS: getVar('rs', 'r_s', 'r s'),
      formulaCS: getVar('Cs', 'cs', 'C_s', 'C s'),
      formulaCU: getVar('Cu', 'cu', 'C_u', 'C u'),
      formulaF,
      formulaP: getVar('P'),
      formulaMR1: getVar('Mr1'),
      formulaMR2: getVar('Mr2'),
    };
  }

  // Extract named solutions (Solution A, B, etc.)
  private extractSolution(
    sectionText: string
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

        let desc = sectionText
          .substring(descStart, descEnd)
          .replace(/\s+/g, ' ')
          .trim();

        // Normalize "ml" to "mL" in the description
        desc = desc.replace(/\bml\b/gi, 'mL');

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
        let desc = mpMatch[1].replace(/\s+/g, ' ').trim();
        // Skip "See Table N" — gradient reference, not a description
        if (!/^See\s+Table/i.test(desc)) {
          // Normalize "ml" to "mL"
          desc = this.normalizeMlUnits(desc);

          solutions.push({
            solutionLetter: 'A',
            solutionDescription: desc,
          });
        }
      }
    }

    return solutions;
  }

  // Helper method to normalize "ml" to "mL"
  private normalizeMlUnits(text: string): string {
    // Replace "ml" with "mL" using case-insensitive pattern
    // Handles: ml, ML, Ml -> all become mL
    // Uses word boundary to avoid replacing "ml" inside words
    return text.replace(/\bml\b/gi, 'mL');
  }

  private extractSolutionTable(
    sectionText: string
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
      // FIX: Cast row[0] to a string to satisfy the ImpuritiesSolutionTable interface
      const obj: ImpuritiesSolutionTable = { solutionTime: String(row[0]) };
      solColumns.forEach((letter, i) => {
        (obj as any)[`solution${letter}Percent`] = row[i + 1];
      });
      return obj;
    });

    return result;
  }

  private findMatchingDetailIndex(
    details: ImpuritiesDetails[],
    parsedName: string
  ): number {

    const normalize = (s: string): string =>
      s
        .toLowerCase()
        .replace(/\(.*?\)/g, '')      // strip parentheticals: "(omeprazole related compound E)"
        .replace(/[-_]/g, ' ')        // normalize hyphens to spaces
        .replace(/[^a-z0-9\s]/g, '')  // strip punctuation
        .replace(/\s+/g, ' ')
        .trim();

    const tokenize = (s: string): Set<string> =>
      new Set(normalize(s).split(' ').filter((t) => t.length > 2));

    // Stop-words that appear in many names and should not drive a match
    const stopWords = new Set([
      'omeprazole', 'related', 'compound', 'analog', 'analogs',
      'impurity', 'any', 'other', 'individual', 'unspecified',
    ]);

    const parsedTokens = tokenize(parsedName);
    const parsedSignificant = [...parsedTokens].filter((t) => !stopWords.has(t));

    let bestIndex = -1;
    let bestScore = 0;

    details.forEach((d, idx) => {
      if (!d.substanceName) return;

      const existingTokens = tokenize(d.substanceName);
      const existingSignificant = [...existingTokens].filter((t) => !stopWords.has(t));

      // Count how many significant tokens from the parsed name appear in the existing name
      const overlap = parsedSignificant.filter((t) => existingTokens.has(t)).length;

      // Require overlap to cover at least 50% of the shorter significant token set
      const minLength = Math.min(parsedSignificant.length, existingSignificant.length);
      if (minLength === 0) return;

      const score = overlap / minLength;

      if (score > bestScore && score >= 0.5) {
        bestScore = score;
        bestIndex = idx;
      }
    });

    return bestIndex;
  }

  async extractImpurityDetails(text: string): Promise<ImpuritiesDetails[]> {

    const details: ImpuritiesDetails[] = [];
    const seenNames = new Set<string>();

    await this.getExistingImpuritiesFromSubstance(0);

    this.existingImpurities.forEach((elementRel) => {
      const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
      newImpuritiesDetails.relatedSubstanceUuid = elementRel.relationshipUuid;
      newImpuritiesDetails.relatedSubstanceUnii = elementRel.relationshipUnii;
      newImpuritiesDetails.substanceName = elementRel.relationshipName;
      details.push(newImpuritiesDetails);
    });


    text = text.replace(/([A-Za-z])-\s+([a-z])/g, '$1$2');
 
    text = text.replace(/(\d)-\s+([a-z])/g, '$1-$2');

    // Strip non-ASCII from end of words
    text = text.replace(/([A-Za-z])[^\x00-\x7F]+/g, '$1');
    // Strip ASCII symbol footnote markers (non-alpha) from end of words
    text = text.replace(/([A-Za-z])[0-9?!@#$%^&*+=|<>]+(?=\s)/g, '$1');

    // OCR "a" artifact → "-"
    text = text.replace(/(?<=[\d.]\s{1,4})a(?=\s{1,4}[\d-])/g, '-');
    text = text.replace(/(?<=\s)a(?=\s+-)/g, '-');

    // Join split dual-RRT rows before normalization
    text = text.replace(
      /([A-Za-z][^\n\r]+?)\s+([\d]+\.[\d]+)\s*[\n\r]+\s*(?:([A-Za-z][^\n\r]*?)\s+)?and\s+([\d]+\.[\d]+)/g,
      (_, p1, rrt1, p2, rrt2) => {
        const p2clean = p2 ? p2.replace(/[\d.\-]+.*$/, '').trim() : '';
        const fullName = p2clean ? `${p1.trim()} ${p2clean}` : p1.trim();
        return `${fullName} ${rrt1} and ${rrt2}`;
      }
    );

    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Locate and isolate table block
    const tableStartMatch = text.match(/\bTable\s+\d+\b/i);
    if (!tableStartMatch || tableStartMatch.index === undefined) {
      // ── FALLBACK: no table found, fill sourceImpurityName from substanceName
      details.forEach((d) => {
        if (!d.sourceImpurityName && d.substanceName) {
          d.sourceImpurityName = d.substanceName;
        }
      });

      return details;
    }

    let tableText = text.substring(tableStartMatch.index);

    const headerMatches = [...tableText.matchAll(/NMT\s*\(%\)/gi)];
    if (headerMatches.length > 0) {
      const lastHeader = headerMatches[headerMatches.length - 1];
      if (lastHeader.index !== undefined) {
        tableText = tableText.substring(lastHeader.index + lastHeader[0].length);
      }
    }

    const tableEnd = tableText.match(
      /\b(?:SPECIFIC\s+TESTS|ADDITIONAL\s+REQUIREMENTS|STORAGE|PACKAGING|LABELING|PERFORMANCE\s+TESTS|PROCEDURE|DEFINITION)\b/
    );
    if (tableEnd?.index !== undefined) {
      tableText = tableText.substring(0, tableEnd.index);
    }

    // Strip single trailing lowercase footnote letter (a-g) from words
    tableText = tableText.replace(
      /\b([A-Za-z]{3,})([a-g])(?=\s+[\d\-])/g,
      (match, word, trailer) => {
        const lastChar = word[word.length - 1];
        if (/[aeiousSzx]$/.test(word)) {
          return word;
        }
        return match;
      }
    );

    // Rejoin split-name dual-RRT rows
    tableText = tableText.replace(
      /([A-Z][A-Za-z\-(),.]*(?:\s+[A-Za-z\-(),.]+)*)\s+([\d]+\.[\d]+)\s+-\s+-\s+([a-z][A-Za-z\s\-(),.]*?)\s+and\s+([\d]+\.[\d]+)/g,
      (match, p1, rrt1, p2, rrt2) => {
        if (/\d/.test(p2)) return match;
        const fullName = `${p1.trim()} ${p2.trim()}`;
        return `${fullName} ${rrt1} and ${rrt2}`;
      }
    );

    // Extract dual-RRT rows BEFORE standard parser
    const dualRrtPattern = /([A-Z][A-Za-z\s\-(),.]+?)\s+([\d]+\.[\d]+)\s+and\s+([\d]+\.[\d]+)/gi;
    const dualRows: { name: string; rrt1: string; rrt2: string }[] = [];

    tableText = tableText.replace(dualRrtPattern, (_, rawName, rrt1, rrt2) => {
      const name = this.cleanImpurityName(rawName);
      if (name.length >= 3 && name.length <= 100) {
        dualRows.push({ name, rrt1, rrt2 });
      }
      return ' __DUAL_RRT__ ';
    });

    // Parse standard rows
    const VALUE = `(?:[\\d]+\\.?[\\d]*|-)`;
    const sepPat = new RegExp(`\\s+(${VALUE})\\s+(${VALUE})\\s+(${VALUE})(?=\\s|$)`, 'g');
    const segments = tableText.split(sepPat);

    const isSkippableRow = (name: string): boolean => {
      const lower = name.toLowerCase().trim();
      if (!lower || lower === 'name') return true;
      if (/^total\b/.test(lower)) return true;
      return false;
    };

    const isUnspecifiedImpurity = (name: string): boolean =>
      /any\b.{0,40}\bimpurit/i.test(name);

    for (let i = 0; i + 3 < segments.length; i += 4) {
      const name = this.cleanImpurityName(segments[i] ?? '');
      const rrt = (segments[i + 1] ?? '').trim();
      const rrf = (segments[i + 2] ?? '').trim();
      const limit = (segments[i + 3] ?? '').trim();

      if (!name) continue;
      if (isSkippableRow(name)) continue;
      if (name.length < 3 || name.length > 100) continue;
      if (/^[\d\s.\-]+$/.test(name)) continue;
      if (seenNames.has(name)) continue;
      if (isUnspecifiedImpurity(name)) continue;

      seenNames.add(name);

      const identityCriteriaList: IdentityCriteria[] = [];
      if (rrt !== '-') identityCriteriaList.push({
        identityCriteriaType: 'RELATIVE RETENTION TIME',
        amountValue: rrt,
      });
      if (rrf !== '-') identityCriteriaList.push({
        identityCriteriaType: 'RELATIVE RESPONSE FACTOR',
        amountValue: rrf,
      });

      const matchedIndex = this.findMatchingDetailIndex(details, name);

      if (matchedIndex !== -1) {
        details[matchedIndex].impurityType = 'SPECIFIED IMPURITY';
        details[matchedIndex].sourceImpurityName = name;
        details[matchedIndex].limitValue = limit !== '-' ? parseFloat(limit) : undefined;
        details[matchedIndex].limitType = 'NMT';
        details[matchedIndex].unit = limit !== '-' ? '%' : undefined;
        details[matchedIndex].identityCriteriaList = identityCriteriaList;
      } else {
        details.push({
          impurityType: 'SPECIFIED IMPURITY',
          sourceImpurityName: name,
          limitValue: limit !== '-' ? parseFloat(limit) : undefined,
          limitType: 'NMT',
          unit: limit !== '-' ? '%' : undefined,
          identityCriteriaList,
        });
      }
    }

    // Add dual-RRT rows
    for (const { name, rrt1, rrt2 } of dualRows) {
      if (seenNames.has(name)) continue;
      seenNames.add(name);

      const dualIdentityCriteria: IdentityCriteria[] = [
        { identityCriteriaType: 'RELATIVE RETENTION TIME', amountValue: rrt1 },
        { identityCriteriaType: 'RELATIVE RETENTION TIME', amountValue: rrt2 },
      ];

      const matchedIndex = this.findMatchingDetailIndex(details, name);

      if (matchedIndex !== -1) {
        details[matchedIndex].impurityType = 'SPECIFIED IMPURITY';
        details[matchedIndex].sourceImpurityName = name;
        details[matchedIndex].limitValue = undefined;
        details[matchedIndex].limitType = 'NMT';
        details[matchedIndex].unit = undefined;
        details[matchedIndex].identityCriteriaList = dualIdentityCriteria;
      } else {
        details.push({
          impurityType: 'SPECIFIED IMPURITY',
          sourceImpurityName: name,
          limitValue: undefined,
          limitType: 'NMT',
          unit: undefined,
          identityCriteriaList: dualIdentityCriteria,
        });
      }
    }

    // Fallback — fill sourceImpurityName from substanceName for unmatched entries
    details.forEach((d) => {
      if (!d.sourceImpurityName && d.substanceName) {
        d.sourceImpurityName = d.substanceName;
      }
    });

    return details;
  }


  // Shared name cleaner for impurity table rows
  private cleanImpurityName(raw: string): string {
    let name = raw.replace(/\s+/g, ' ').trim();
    // Strip trailing footnote digits
    name = name.replace(/\s*\d+\s*$/, '').trim();
    // Strip non-alpha/hyphen/paren symbols
    name = name.replace(/[^A-Za-z0-9\s\-()\-,.]/g, '').trim();

    name = name.replace(/^\d+\s+(?=[A-Z])/g, '').trim();
    // Take the last capital-starting phrase (strips header bleed)
    const lastPhrase = name.match(/[A-Z\d][A-Za-z0-9\s\-(),.]*$/);
    return lastPhrase ? lastPhrase[0].trim() : name;
  }

  private extractUnspecified(
    text: string
  ): ImpuritiesUnspecified[] {
    const unspecified: ImpuritiesUnspecified[] = [];

    // Table format: "Any other individual impurity - 1.0 0.10"
    // Where: RRT="-", RRF="1.0", Limit="0.10"
    const match = text.match(
      /Any\s+(?:other\s+)?(?:individual\s+)?(?:unspecified\s+)?[-–—\s]*impurit(?:y|ies)\s+[-–—]\s+([\d.]+)\s+([\d.]+)/i
    );

    if (match) {
      const rrfValue = match[1];    // First number after "-" is RRF
      const limitVal = parseFloat(match[2]);  // Second number is limit

      if (!isNaN(limitVal) && limitVal > 0) {

        // Build identityCriteriaList
        const identityCriteriaList: IdentityCriteria[] = [];

        if (rrfValue && rrfValue !== '-') {
          identityCriteriaList.push({
            identityCriteriaType: 'RELATIVE RESPONSE FACTOR',
            amountValue: rrfValue
          });
        }

        unspecified.push({
          impurityType: 'UNSPECIFIED IMPURITY',
          limitValue: limitVal,
          limitType: 'NMT',
          unit: '%',
          identityCriteriaList
        });
      }
    }

    return unspecified;
  }

  private extractInorganicImpurities(
    text: string,
    source: string,
    sourceType: string,
    sourceId: string
  ): ImpuritiesInorganicTest[] {

    const match = text.match(
      /Res(?:idue)?(?:\s*on\s*|\s*ON\s*)?(?:Ign(?:ition)?|IGN(?:ITION)?)\s*(?:\(?\s*281\s*[_.]?\s*\)?)?\s*[\s_.:]*\s*(NMT|NLT)?\s*[\s_.:]*\s*([\d.]+)\s*(%)?/i
    );

    if (!match) return [];

    const limitType = match[1]?.toUpperCase() ?? 'NMT';
    const limitValue = match[2];

    const inorganicEntry: ImpuritiesInorganic = {
      substanceName: '',
      limitValue,
      limitType,
      unit: '%',
      testType: 'USP Residue on Ignition (281)',
      comments: ''
    };

    const inorganicTest: ImpuritiesInorganicTest = {
      source,
      sourceType,
      sourceId,
      test: 'INORGANIC IMPURITIES',
      testType: '',
      impuritiesInorganicList: [inorganicEntry]
    };

    return [inorganicTest];
  }

  private extractResidualSolventsTest(
    text: string,
    source: string,
    sourceType: string,
    sourceId: string
  ): ImpuritiesResidualSolventsTest[] {

    const match = text.match(
      /Loss\s*on\s*D(?:ry(?:ing)?|avin\w*)\s*(?:\(?\s*731\s*\)?)?\s*[\s\S]*?(?:Acceptance\s+criteria|criteria)\s*:\s*(NMT|NLT)?\s*[\s_.:]*\s*([\d.]+)\s*(%)?/i
    );

    if (!match) return [];

    // Extract Analysis line: "Dry at 110° for 15 h."
    const analysisMatch = text.match(
      /Loss\s*on\s*D(?:ry(?:ing)?|avin\w*)\s*(?:\(?\s*731\s*\)?)?\s*[\s\S]*?Analysis\s*:\s*([^\n.]+\.)/i
    );
    const analysis = analysisMatch
      ? analysisMatch[1].replace(/\s+/g, ' ').trim()
      : '';

    const limitType = match[1]?.toUpperCase() ?? 'NMT';
    const limitValue = parseFloat(match[2]);

    const residualSolventEntry: ImpuritiesResidualSolvents = {
      testType: 'USP Loss on Drying (731)',
      analysis,
      limitType,
      limitValue,
      unit: '%',
      comments: ''
    };

    const residualSolventsTest: ImpuritiesResidualSolventsTest = {
      source,
      sourceType,
      sourceId,
      test: 'RESIDUAL SOLVENTS',
      testType: '',
      impuritiesResidualSolventsList: [residualSolventEntry]
    };

    return [residualSolventsTest];
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
      unit: '%'
    };
  }

  /***** IMPORT USP MONOGRAPH END **************************************************************/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/



  /*###########################################################################################*/
  /******IMPORT EP MONOGRAPSH START ************************************************************/

  async europeanMapToImpuritiesModel(extractedDoc: ExtractedDocument, pdfFile: File): Promise<Impurities> {
    const rawText = extractedDoc.fullText;

    // Get the Substance Name from pdf file
    const substanceName = this.europeanExtractSubstanceName(rawText);

    // Clean the texts in pdf file
    const cleanText = this.healOcrArtifacts(rawText, substanceName);

    // if Substance Name is found in pdf, get Substance UUID by Substance Name.
    if (substanceName) {
      await this.getSubstanceNameDetails(substanceName);
    }

    // Get Source, Source Type, and Source ID
    const { source, sourceType, sourceId } = this.europeanExtractSource(cleanText);

    // Get Assay Low, Assay High, Unit, and comments
    const { assayLow, assayHigh, unit, comments } = this.europeanExtractAssayLimits(cleanText);

    // Split into multiple sections from pdf file
    const {
      testsBlock,
      assayText,
      impuritiesBlock,
      epSubTests
    } = this.epSplitSections(cleanText);

    // Extract date from monograph
    const dateType = 'Official Date';
    let dateTypeDate = '';
    const dateMatch = rawText.match(/EUROPEAN\s+PHARMACOPOEIA\s+([\d/:.]+)/i);
    if (dateMatch) {
      const rawDate = dateMatch[1].trim();
      // Parse format MM/YYYY:#### or MM/YYYY and convert to MM/01/YYYY
      const parts = rawDate.split(/[/:]/);
      if (parts.length >= 2) {
        const month = parts[0].padStart(2, '0');
        const year = parts[1];
        dateTypeDate = `${month}/01/${year}`;
      } else {
        dateTypeDate = rawDate;
      }
    }

    // Page break strip helper
    const stripPageBreaks = (text: string): string =>
      text
        .replace(
          /General\s+Notices\s+apply\s+to\s+all\s+monographs[\s\S]*?See\s+the\s+information\s+on\s+general\s+monographs\s+\d+/gi,
          ''
        )
        .replace(
          /EUROPEAN\s+PHARMACOPOEIA\s+[\d/:.]+\s+[A-Z][a-zA-Z\s]{2,50}(?=\s+(?:Test\s+solution|Reference\s+solution|Column|Mobile\s+phase|Flow\s+rate|Detection|Injection|System\s+[Ss]uitability|Limits|Relative\s+retention|Calculation|Loss|Sulfated|Water\s+\())/gi,
          ''
        )
        .replace(/\s+/g, ' ')
        .trim();

    // Clean section texts
    const cleanTestsBlock = stripPageBreaks(testsBlock);
    const cleanAssayText = stripPageBreaks(assayText);
    const cleanImpuritiesBlock = stripPageBreaks(impuritiesBlock);

    // Slice Related substances sub-section
    let relSubstText = '';
    if (cleanTestsBlock) {
      const relSubstIdx = cleanTestsBlock.search(/\bRelated\s+substances\b/i);
      if (relSubstIdx !== -1) {
        const relSubstEnd = cleanTestsBlock
          .substring(relSubstIdx)
          .search(
            /(?:Loss\s+on\s+drying|Sulfated\s+ash|Heavy\s+metals|Water\s+\(|ASSAY|Magnesium|Sulfate\s*:|pH\b)/i
          );
        relSubstText = relSubstEnd !== -1
          ? cleanTestsBlock.substring(relSubstIdx, relSubstIdx + relSubstEnd)
          : cleanTestsBlock.substring(relSubstIdx);
      } else {
        relSubstText = cleanTestsBlock;
      }
    }

    const impuritiesTestList: ImpuritiesTesting[] = [];
    const impuritiesInorganicTestList: ImpuritiesInorganicTest[] = [];
    const impuritiesResidualSolventsTestList: ImpuritiesResidualSolventsTest[] = [];

    // SPECIFIC TESTS
    const epSpecificTests = this.epExtractSpecificTests(
      cleanTestsBlock,
      source,
      sourceType,
      sourceId
    );

    let impuritiesSpecificTestList: ImpuritiesSpecificTest[] = [];
    impuritiesSpecificTestList.push(...epSpecificTests);

    // EP Chromatographic ASSAY
    if (
      cleanAssayText &&
      /Liquid\s+[Cc]hromatography|spectrophotometer\s+at\s+\d+\s*nm/i.test(cleanAssayText)
    ) {
      const test1 = await this.epMapToTest(
        'ASSAY',
        cleanAssayText,
        cleanImpuritiesBlock,
        source,
        sourceId,
        sourceType,
        pdfFile
      );

      impuritiesTestList.push(test1);
    }

    // Map each EP sub-test based on classification
    for (const subTest of epSubTests) {
      const cleanSubTestText = stripPageBreaks(subTest.text);

      switch (subTest.testClass) {
        case 'CHROMATOGRAPHIC': {
          let testLabel = '';

          if (/Related\s+substances/i.test(subTest.label)) {
            testLabel = 'ORGANIC IMPURITIES';
          } else if (/Enantiomeric\s+purity/i.test(subTest.label)) {
            testLabel = 'ENANTIOMERIC PURITY';
          } else if (/Chiral\s+purity/i.test(subTest.label)) {
            testLabel = 'ENANTIOMERIC PURITY';
          } else if (/Optical\s+rotation/i.test(subTest.label)) {
            testLabel = 'OPTICAL ROTATION';
          } else if (/Absorbance\s+ratio/i.test(subTest.label)) {
            testLabel = 'ABSORBANCE RATIO';
          } else {
            testLabel = subTest.label.toUpperCase();
          }

          const test2 = await this.epMapToTest(
            testLabel,
            cleanSubTestText,
            cleanImpuritiesBlock,
            source,
            sourceId,
            sourceType,
            pdfFile
          );

          impuritiesTestList.push(test2);
          break;
        }

        case 'INORGANIC': {
          const inorganic = this.epExtractInorganicImpurities(
            cleanSubTestText, source, sourceType, sourceId
          );
          impuritiesInorganicTestList.push(...inorganic);
          break;
        }

        case 'RESIDUAL': {
          const residual = this.epExtractResidualSolventsTest(
            cleanSubTestText, source, sourceType, sourceId
          );
          impuritiesResidualSolventsTestList.push(...residual);
          break;
        }

        case 'SPECIFIC_IMPURITY': {
          const inorganic = this.epExtractInorganicImpurities(
            cleanSubTestText, source, sourceType, sourceId
          );
          impuritiesInorganicTestList.push(...inorganic);
          break;
        }

        case 'PHYSICAL':
          // Skip — not mapped to impurities model
          break;

        case 'OTHER':
          console.warn(`EP sub-test not classified: "${subTest.label}"`);
          break;
      }
    }

    // Fallback: inorganic / residual not found in epSubTests
    if (impuritiesResidualSolventsTestList.length === 0) {
      const residual = this.epExtractResidualSolventsTest(
        cleanTestsBlock, source, sourceType, sourceId
      );
      impuritiesResidualSolventsTestList.push(...residual);
    }

    if (impuritiesInorganicTestList.length === 0) {
      const inorganic = this.epExtractInorganicImpurities(
        cleanTestsBlock, source, sourceType, sourceId
      );
      impuritiesInorganicTestList.push(...inorganic);
    }

    // Total impurities
    const impuritiesTotal = this.epExtractTotal(
      relSubstText || cleanTestsBlock,
      cleanText
    );

    // Substance object
    const substance: ImpuritiesSubstance = {
      substanceUuid: this.substanceUuid ?? '',
      approvalID: this.substanceApprovalId ?? '',
      low: assayLow,
      high: assayHigh,
      unit,
      comments,
      impuritiesTestList,
      impuritiesResidualSolventsTestList,
      impuritiesInorganicTestList,
      impuritiesSpecificTestList
    };

    return {
      source,
      sourceType,
      sourceId,
      type: 'DRUG SUBSTANCE',
      specType: 'Accepted',
      productId: this.substanceApprovalId,
      productSubstanceName: substanceName,
      submitterName: '',
      dateType,
      dateTypeDate,
      impuritiesSubstanceList: [substance],
      impuritiesTotal
    };
  }

  epSplitSections(fullText: string): {
    testsBlock: string;
    assayText: string;
    impuritiesBlock: string;
    epSubTests: { label: string; text: string; testClass: string }[];
  } {
    const testsIdx = fullText.search(/\bTESTS\b/);
    const assayIdx = fullText.search(/\bASSAY\b/);
    const storageIdx = fullText.search(/\bSTORAGE\b/);
    const impuritiesIdx = fullText.indexOf(
      'IMPURITIES',
      assayIdx > -1 ? assayIdx : 0
    );

    const testsBlock = (testsIdx !== -1 && assayIdx !== -1)
      ? fullText.substring(testsIdx, assayIdx)
      : '';

    const assayText = assayIdx !== -1
      ? fullText.substring(
        assayIdx,
        storageIdx > assayIdx ? storageIdx :
          impuritiesIdx > assayIdx ? impuritiesIdx :
            fullText.length
      )
      : '';

    const storageText = storageIdx !== -1
      ? fullText.substring(
        storageIdx,
        impuritiesIdx > storageIdx ? impuritiesIdx : fullText.length
      )
      : '';

    const impuritiesBlock = impuritiesIdx !== -1
      ? fullText.substring(impuritiesIdx)
      : '';

    // Strip page break artifacts before detecting sub-tests
    const cleanTestsBlock = testsBlock
      .replace(
        /General\s+Notices\s+apply\s+to\s+all\s+monographs[\s\S]*?See\s+the\s+information\s+on\s+general\s+monographs\s+\d+/gi,
        ''
      )
      .replace(
        /EUROPEAN\s+PHARMACOPOEIA\s+[\d/:.]+\s+[A-Z][a-zA-Z\s]{2,50}(?=\s+(?:Test\s+solution|Reference\s+solution|Column|Mobile\s+phase|Flow\s+rate|Detection|Injection|System\s+[Ss]uitability|Limits|Relative\s+retention|Calculation|Loss|Sulfated|Water\s+\())/gi,
        ''
      )
      .replace(/\s+/g, ' ')
      .trim();

    // Known EP sub-test headings
    // Only these specific patterns qualify as sub-test headings in EP TESTS block
    // This prevents "Test solution", "Reference solution", "Column" etc.
    // from being incorrectly detected as sub-test headings
    const knownSubTestPatterns: {
      pattern: RegExp;
      testClass: string;
      label: string;
    }[] = [
        // Chromatographic tests
        {
          pattern: /\bRelated\s+substances\s*\./i,
          testClass: 'CHROMATOGRAPHIC',
          label: 'Related substances'
        },
        {
          pattern: /\bEnantiomeric\s+purity\s*\./i,
          testClass: 'CHROMATOGRAPHIC',
          label: 'Enantiomeric purity'
        },
        {
          pattern: /\bChiral\s+purity\s*\./i,
          testClass: 'CHROMATOGRAPHIC',
          label: 'Chiral purity'
        },
        {
          pattern: /\bOptical\s+rotation\s*\./i,
          testClass: 'CHROMATOGRAPHIC',
          label: 'Optical rotation'
        },
        {
          pattern: /\bAbsorbance\s+ratio\s*\./i,
          testClass: 'CHROMATOGRAPHIC',
          label: 'Absorbance ratio'
        },

        // Inorganic tests
        {
          pattern: /\bSulfated\s+ash\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'INORGANIC',
          label: 'Sulfated ash'
        },
        {
          pattern: /\bHeavy\s+metals\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'INORGANIC',
          label: 'Heavy metals'
        },
        {
          pattern: /\bResidue\s+on\s+ignition\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'INORGANIC',
          label: 'Residue on ignition'
        },

        // Residual solvents / water
        {
          pattern: /\bLoss\s+on\s+drying\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'RESIDUAL',
          label: 'Loss on drying'
        },
        {
          pattern: /\bWater\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'RESIDUAL',
          label: 'Water'
        },
        {
          pattern: /\bResidual\s+solvents\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'RESIDUAL',
          label: 'Residual solvents'
        },

        // Physical tests — detected but skipped
        {
          pattern: /\bpH\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'PHYSICAL',
          label: 'pH'
        },
        {
          pattern: /\bSpecific\s+optical\s+rotation\s*(?:\([^)]+\))?\s*:/i,
          testClass: 'PHYSICAL',
          label: 'Specific optical rotation'
        },
        {
          pattern: /\bAppearance\s+of\s+solution\s*\./i,
          testClass: 'PHYSICAL',
          label: 'Appearance of solution'
        },
        {
          pattern: /\bSolution\s+S\s*\./i,
          testClass: 'PHYSICAL',
          label: 'Solution S'
        },
        {
          pattern: /\bImpurit(?:y|ies)\s+[A-Z]\s+and\s+[A-Z]\s*:/i,
          testClass: 'SPECIFIC_IMPURITY',
          label: 'Specific impurity limit'
        },
      ];

    // Find all sub-test start positions
    const subTestStarts: {
      label: string;
      index: number;
      testClass: string;
    }[] = [];

    for (const def of knownSubTestPatterns) {
      const m = def.pattern.exec(cleanTestsBlock);
      if (m) {
        subTestStarts.push({
          label: def.label,
          index: m.index,
          testClass: def.testClass
        });
      }
    }

    // Sort by position in text
    subTestStarts.sort((a, b) => a.index - b.index);

    // Slice each sub-test block
    const epSubTests: { label: string; text: string; testClass: string }[] = [];

    for (let i = 0; i < subTestStarts.length; i++) {
      const start = subTestStarts[i].index;
      const end = i + 1 < subTestStarts.length
        ? subTestStarts[i + 1].index
        : cleanTestsBlock.length;

      epSubTests.push({
        label: subTestStarts[i].label,
        text: cleanTestsBlock.slice(start, end),
        testClass: subTestStarts[i].testClass
      });
    }

    return {
      testsBlock: cleanTestsBlock,
      assayText,
      impuritiesBlock,
      epSubTests
    };
  }

  private epExtractSpecificTests(
    testsBlock: string,
    source: string,
    sourceType: string,
    sourceId: string
  ): ImpuritiesSpecificTest[] {
    if (!testsBlock?.trim()) {
      return [];
    }

    const tests: ImpuritiesSpecificTest[] = [];

    // Normalize whitespace but preserve structure
    const text = testsBlock.replace(/\s+/g, ' ').trim();

    // Define test boundaries - these are the main test section headings
    const testBoundaries = [
      'pH',
      'Specific optical rotation',
      'Optical rotation',
      'Related substances',
      'Solution S',
      'Appearance of solution',
      'Sulfate',
      'Chloride',
      'Heavy metals',
      'Loss on drying',
      'Sulfated ash',
      'Water',
      'Iron',
      'Arsenic',
      'Impurities',
      'ASSAY'
    ];

    // Only match boundary terms when preceded by ". " (sentence end) or at position 0,
    // and followed by "(" or ":" — so mid-sentence reagent words like "water R" are ignored.
    const boundaryPattern = new RegExp(
      `(?:\\. )(${testBoundaries.join('|')})(?=\\s*[:(])`,
      'i'
    );

    // Specific test patterns — order by specificity, more specific first
    const specificTestPatterns: {
      pattern: RegExp;
      label: string;
      testType: 'limit' | 'physical' | 'preparation';
    }[] = [
        {
          pattern: /\bpH\s*\(\s*\d+\.\d+\.\d+\s*\)\s*:/i,
          label: 'pH',
          testType: 'physical'
        },
        {
          pattern: /\bSpecific\s+optical\s+rotation\s*\(\s*\d+\.\d+\.\d+\s*\)\s*:/i,
          label: 'Specific optical rotation',
          testType: 'physical'
        },
        {
          pattern: /\bSolution\s+S\s*:/i,
          label: 'Solution S',
          testType: 'preparation'
        },
        {
          pattern: /\bAppearance\s+of\s+solution\s*:/i,
          label: 'Appearance of solution',
          testType: 'physical'
        },
        {
          pattern: /\bSulfate\s*:/i,
          label: 'Sulfate',
          testType: 'limit'
        },
        {
          pattern: /\bChloride\s*\(/i,
          label: 'Chloride',
          testType: 'limit'
        },
        {
          pattern: /\bLoss\s+on\s+drying\s*\(\s*\d+\.\d+\.\d+\s*\)\s*:/i,
          label: 'Loss on drying',
          testType: 'limit'
        },
        {
          pattern: /\bSulfated\s+ash\s*\(/i,
          label: 'Sulfated ash',
          testType: 'limit'
        },
        {
          pattern: /\bHeavy\s+metals\s*\(/i,
          label: 'Heavy metals',
          testType: 'limit'
        },
        {
          pattern: /\bWater\s*\(/i,
          label: 'Water',
          testType: 'limit'
        },
        {
          pattern: /\bImpurit(?:y|ies)\s+[A-Z]/i,
          label: 'Impurities',
          testType: 'limit'
        }
      ];

    // Track extracted positions to avoid duplicates
    const extractedPositions: number[] = [];

    for (const testDef of specificTestPatterns) {
      const match = testDef.pattern.exec(text);
      if (!match) continue;

      const startIndex = match.index;

      // Skip if we already extracted a test at this position
      if (extractedPositions.some(pos => Math.abs(pos - startIndex) < 10)) {
        continue;
      }

      const remainingText = text.substring(startIndex);
      const searchFrom = remainingText.substring(match[0].length);
      const nextTestMatch = searchFrom.search(boundaryPattern);

      // +1 to include the period that is now part of the boundary pattern match,
      // so the current block captures its final sentence completely.
      const blockEnd = nextTestMatch !== -1
        ? startIndex + match[0].length + nextTestMatch + 1
        : text.length;

      const block = text.substring(startIndex, blockEnd).trim();

      const chapterMatch = block.match(/\(\s*(\d+\.\d+\.\d+)\s*\)/);
      const testType = chapterMatch
        ? `${testDef.label} (${chapterMatch[1]})`
        : testDef.label;

      const details = this.extractSpecificTestDetails(block, testDef.label, testDef.testType);

      if (details.analysis || details.acceptanceCriteria) {
        tests.push({
          testType,
          sampleSolution: '',
          analysis: details.analysis,
          acceptanceCriteria: details.acceptanceCriteria,
          otherDescription: details.otherDescription,
          comments: ''
        });

        extractedPositions.push(startIndex);
      }
    }

    return tests;
  }

  private extractSpecificTestDetails(
    block: string,
    label: string,
    testType: 'limit' | 'physical' | 'preparation'
  ): {
    analysis: string;
    acceptanceCriteria: string;
    otherDescription: string;
  } {
    let analysis = '';
    let acceptanceCriteria = '';
    let otherDescription = '';

    // Helper: extract one complete sentence starting at the first match of startPattern.
    // Tracks parenthesis depth so periods inside "(96 per cent)" don't end the sentence.
    // Stops when a period is followed by an uppercase word that is not a single-letter
    // reagent abbreviation like "R," or "R;" — those continue the sentence.
    const extractCompleteSentence = (text: string, startPattern: RegExp): string => {
      const match = startPattern.exec(text);
      if (!match) return '';

      const startPos = match.index;
      const remaining = text.substring(startPos);

      let sentence = '';
      let depth = 0;

      for (let i = 0; i < remaining.length; i++) {
        const char = remaining[i];
        sentence += char;

        if (char === '(') depth++;
        if (char === ')') depth--;

        if (char === '.' && depth === 0) {
          const nextChars = remaining.substring(i + 1, i + 10).trim();

          // End the sentence if nothing follows, or next word is a new section heading,
          // or next word starts uppercase and is not a single-letter reagent abbreviation
          if (
            !nextChars ||
            /^(Loss|Sulfate|Chloride|Heavy|Water|ASSAY|Related|Solution|Appearance|Impurit)/i.test(nextChars) ||
            (/^[A-Z]/.test(nextChars) && !/^[A-Z]\s*[,;]/.test(nextChars))
          ) {
            break;
          }
        }
      }

      return sentence.trim();
    };

    // Solution S (preparation)
    if (/solution\s+s/i.test(label)) {
      const dissolveMatch = block.match(/Dissolve\s+[^.]+\./i);
      if (dissolveMatch) {
        analysis = dissolveMatch[0].trim();
      }
    }

    // Appearance of solution
    else if (/appearance\s+of\s+solution/i.test(label)) {
      const clarityMatch = block.match(
        /Solution\s+S\s+is\s+(?:clear|not\s+more\s+intensely\s+colou?red)[^.]*\./i
      );
      if (clarityMatch) {
        analysis = clarityMatch[0].trim();
        acceptanceCriteria = clarityMatch[0].trim();
      }
    }

    // pH
    else if (/^pH$/i.test(label)) {
      // Acceptance criteria: the range after the colon, e.g. "2.0 to 4.0"
      const rangeMatch = block.match(/pH\s*\([^)]+\)\s*:\s*(\d+\.\d+)\s+to\s+(\d+\.\d+)/i);
      if (rangeMatch) {
        acceptanceCriteria = `${rangeMatch[1]} to ${rangeMatch[2]}`;
      }

      // Analysis: the full preparation sentence beginning with "Dissolve"
      analysis = extractCompleteSentence(block, /Dissolve\s+/i);
    }

    // Specific optical rotation / Optical rotation
    else if (/optical\s+rotation/i.test(label)) {
      const rangeMatch = block.match(/:\s*([-+]\s*\d+)\s+to\s+([-+]\s*\d+)/i);
      if (rangeMatch) {
        acceptanceCriteria = `${rangeMatch[1].replace(/\s+/g, '')} to ${rangeMatch[2].replace(/\s+/g, '')}`;

        if (/\(dried\s+substance\)/i.test(block)) {
          acceptanceCriteria += ' (dried substance)';
        } else if (/\(anhydrous\s+substance\)/i.test(block)) {
          acceptanceCriteria += ' (anhydrous substance)';
        }
      }

      // Analysis: the full preparation sentence beginning with "Dissolve"
      analysis = extractCompleteSentence(block, /Dissolve\s+/i);
    }

    // Sulfate
    else if (/^sulfate$/i.test(label)) {
      const percentRangeMatch = block.match(
        /Sulfate\s*:\s*(\d+\.\d+)\s+per\s+cent\s+to\s+(\d+\.\d+)\s+per\s+cent/i
      );
      if (percentRangeMatch) {
        acceptanceCriteria = `${percentRangeMatch[1]} per cent to ${percentRangeMatch[2]} per cent`;
        if (/\(dried\s+substance\)/i.test(block)) {
          acceptanceCriteria += ' (dried substance)';
        }
      } else {
        const ppmMatch = block.match(/maximum\s+(\d+)\s+ppm/i);
        if (ppmMatch) {
          acceptanceCriteria = `maximum ${ppmMatch[1]} ppm`;
        }
      }

      // Analysis: collect every sentence from "Dissolve" onward, stopping at the
      // equivalence statement (inclusive) or the start of the next test heading.
      const dissolveMatch = block.match(/Dissolve\s+/i);
      if (dissolveMatch) {
        const startPos = block.indexOf(dissolveMatch[0]);
        let currentText = block.substring(startPos);

        const sentences: string[] = [];
        let foundEquivalence = false;

        while (currentText.length > 0 && !foundEquivalence) {
          let sentenceEnd = -1;
          let depth = 0;

          for (let i = 0; i < currentText.length; i++) {
            if (currentText[i] === '(') depth++;
            if (currentText[i] === ')') depth--;

            if (currentText[i] === '.' && depth === 0) {
              const nextPart = currentText.substring(i + 1, i + 20).trim();
              if (!nextPart || (/^[A-Z]/.test(nextPart) && !/^[A-Z]\s*[,;]/.test(nextPart))) {
                sentenceEnd = i;
                break;
              }
            }
          }

          if (sentenceEnd === -1) {
            // No sentence-ending period found; capture remaining text as-is
            const remainder = currentText.trim();
            if (remainder) sentences.push(remainder);
            break;
          }

          const sentence = currentText.substring(0, sentenceEnd + 1).trim();

          // Stop if we've crossed into the next test section
          if (/^(Loss\s+on\s+drying|Sulfated\s+ash|Heavy\s+metals|ASSAY)/i.test(sentence)) {
            break;
          }

          sentences.push(sentence);

          if (/is\s+equivalent\s+to/i.test(sentence)) {
            foundEquivalence = true;
          }

          currentText = currentText.substring(sentenceEnd + 1).trim();
        }

        analysis = sentences.join(' ');
      }

      // Look for "Limits:" section and extract full description into otherDescription
      const limitsDescMatch = block.match(/Limits\s*:\s*([^.]+(?:\.[^.]+)?)\./i);
      if (limitsDescMatch) {
        otherDescription = limitsDescMatch[1].trim();
      }
    }

    // Chloride
    else if (/^chloride$/i.test(label)) {
      const limitMatch = block.match(/(?:maximum\s+)?(\d+)\s+ppm/i);
      if (limitMatch) {
        acceptanceCriteria = `maximum ${limitMatch[1]} ppm`;
      }

      // Use depth-tracking helper instead of naive sentence splitter
      analysis = extractCompleteSentence(block, /(?:Dissolve|Use)\s+/i);
    }

    // Loss on drying
    else if (/loss\s+on\s+drying/i.test(label)) {
      const criteriaMatch = block.match(/maximum\s+([\d.]+)\s+per\s+cent/i);
      if (criteriaMatch) {
        acceptanceCriteria = `maximum ${criteriaMatch[1]} per cent`;
      }

      const colonPos = block.indexOf(':');
      if (colonPos !== -1) {
        let raw = block.substring(colonPos + 1).trim();

        // Strip the acceptance criteria prefix so analysis contains only the procedure.
        // EP format: "Loss on drying (ref): maximum X per cent, determined on..."
        // We want analysis = "determined on 0.500 g by drying in an oven at 105 °C..."
        if (acceptanceCriteria) {
          const escapedCriteria = acceptanceCriteria.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const criteriaPrefix = new RegExp(`^${escapedCriteria}[,\\s]+`, 'i');
          raw = raw.replace(criteriaPrefix, '');
        }

        analysis = raw;
      }
    }

    // Sulfated ash
    else if (/sulfated\s+ash/i.test(label)) {
      const criteriaMatch = block.match(/maximum\s+([\d.]+)\s+per\s+cent/i);
      if (criteriaMatch) {
        acceptanceCriteria = `maximum ${criteriaMatch[1]} per cent`;
      }

      const colonPos = block.indexOf(':');
      if (colonPos !== -1) {
        analysis = block.substring(colonPos + 1).trim();
      }
    }

    // Specific Impurities (e.g., Impurities F and G)
    else if (/impurit/i.test(label)) {
      const absorbanceMatch = block.match(/(?:The\s+)?absorbance[^.]+\./i);
      if (absorbanceMatch) {
        analysis = absorbanceMatch[0].trim();
      }

      const ppmMatch = block.match(/maximum\s+[\d.]+\s+ppm/i);
      if (ppmMatch) {
        acceptanceCriteria = ppmMatch[0].trim();
      }
    }

    // Other limit tests (Heavy metals, Water, Iron, Arsenic, etc.)
    else if (testType === 'limit') {
      const ppmMatch = block.match(/maximum\s+(\d+)\s+ppm/i);
      if (ppmMatch) {
        acceptanceCriteria = `maximum ${ppmMatch[1]} ppm`;
      }

      analysis = extractCompleteSentence(block, /(?:Dissolve|Use)\s+/i);
    }

    return {
      analysis,
      acceptanceCriteria,
      otherDescription
    };
  }

  europeanExtractSubstanceName(text: string): string {

    const monoMatch = text.match(
      /EUROPEAN\s+PHARMACOPOEIA\.?\s+\d{2}\/\d{4}:\d{4}\s+([A-Z][a-z][A-Za-z\s\-]*?)(?=\s+[A-Z]{3,})/
    );
    if (monoMatch) {
      const candidate = monoMatch[1].trim();
      if (
        candidate.length > 2 &&
        candidate.length < 100 &&
        // Reject Latin INN names ending in -um, -us, -ium
        !/\b\w+(?:um|us|ium)\s*$/i.test(candidate) &&
        // Reject edition/version strings
        !/^\d/.test(candidate)
      ) {
        return candidate;
      }
    }

    // Title Case name before ALL CAPS repeat
    // The substance name always appears in Title Case immediately followed
    // by the same name in ALL CAPS
    const titleBeforeCapsMatch = text.match(
      /([A-Z][a-z][A-Za-z\s\-]{2,50}?)\s+([A-Z]{4,})\s/
    );
    if (titleBeforeCapsMatch) {
      const titleCase = titleBeforeCapsMatch[1].trim();
      const allCaps = titleBeforeCapsMatch[2].trim();

      // Verify they match (same letters, different case)
      if (
        titleCase.replace(/\s/g, '').toLowerCase() ===
        allCaps.replace(/\s/g, '').toLowerCase()
      ) {
        if (
          titleCase.length > 2 &&
          !/\b\w+(?:um|us|ium)\s*$/i.test(titleCase) &&
          !/^European|^Pharmacopoeia/i.test(titleCase)
        ) {
          return titleCase;
        }
      }
    }

    const capsMatch = text.match(
      /EUROPEAN\s+PHARMACOPOEIA[\s\S]{0,100}?\b([A-Z]{4,})\b/
    );
    if (capsMatch) {
      const caps = capsMatch[1];
      const titleCase = caps.charAt(0).toUpperCase() +
        caps.slice(1).toLowerCase();

      if (
        titleCase.length > 3 &&
        !/^European|^Pharmacopoeia/i.test(titleCase)
      ) {
        return titleCase;
      }
    }

    const defIdx = text.toLowerCase().indexOf('definition');
    if (defIdx !== -1) {
      const zone = text.substring(0, defIdx);
      const titleMatch = zone.match(
        /([A-Z][a-z][A-Za-z]*(?:\s+[A-Z][a-z][A-Za-z]*)*)/
      );
      if (titleMatch) {
        const candidate = titleMatch[1].trim();
        if (
          candidate.length > 3 &&
          !/\b\w+(?:um|us|ium)\s*$/i.test(candidate) &&
          !/^European|^Pharmacopoeia/i.test(candidate)
        ) {
          return candidate;
        }
      }
    }

    return '';
  }

  europeanExtractSource(text: string): {
    source: string;
    sourceType: string;
    sourceId: string;
  } {

    // Format: "EUROPEAN PHARMACOPOEIA 07/2021:0942"
    //         "EUROPEAN PHARMACOPOEIA 01/2026:2932"
    const headerMatch = text.match(
      /EUROPEAN\s+PHARMACOPOEIA\s+(\d{2}\/\d{4}):(\d{4})/i
    );

    const edition = headerMatch ? headerMatch[1] : '';
    const sourceId = headerMatch ? headerMatch[2] : '';

    return {
      source: 'EP',
      sourceType: 'MONOGRAPH',
      sourceId // e.g. "0942" or "2932"
    };
  }

  europeanExtractAssaySection(text: string): string {

    // Match from "ASSAY" heading to the next major section (STORAGE, IMPURITIES, etc.)
    const assayMatch = text.match(
      /ASSAY\s+([\s\S]+?)(?=\s+(?:STORAGE|IMPURITIES|LABELLING|$))/i
    );

    return assayMatch ? assayMatch[1].trim() : '';
  }

  europeanExtractAssayLimits(text: string): {
    assayLow: number;
    assayHigh: number;
    unit: string;
    comments: string;
  } {
    // Extract ASSAY section for procedure
    const assaySection = this.europeanExtractAssaySection(text);

    // Extract limits from DEFINITION section
    const definitionMatch = text.match(
      /DEFINITION[\s\S]+?Content\s*:\s*([\d.]+)\s*per\s*cent\s+to\s+([\d.]+)\s*per\s*cent/i
    );

    let assayLow = 0;
    let assayHigh = 0;

    if (definitionMatch) {
      assayLow = parseFloat(definitionMatch[1]);
      assayHigh = parseFloat(definitionMatch[2]);
    }

    // Check if ASSAY section is chromatography-based
    const isChromatography = /(?:liquid|gas)\s+chromatography\s*\(\s*2\.2\.29\s*\)/i.test(assaySection);

    return {
      assayLow,
      assayHigh,
      unit: '%',
      comments: isChromatography ? '' : assaySection.trim(),
    };
  }

  async epMapToTest(
    testLabel: string,
    sectionText: string,
    impuritiesBlock: string,
    source: string,
    sourceId: string,
    sourceType: string,
    pdfFile?: File
  ): Promise<ImpuritiesTesting> {

    const now = Date.now();
    const buffer = '';

    // Column
    const { columnSize, columnPackingSize, columnPackingType, columnStationaryPhase } =
      this.epDetectColumn(sectionText);

    const { flowRate, detectorWavelength, injectionVolumeAmount, autosamplerTemperature } =
      this.epDetectChromatographicParams(sectionText);

    // ── Mobile Phase
    const elutionType = this.epDetectMobilePhaseTable(sectionText);
    const impuritiesSolutionList = this.epExtractMobilePhaseSolution(sectionText, now);
    const impuritiesSolutionTableList = elutionType === 'GRADIENT'
      ? this.epExtractMobilePhaseTableRows(sectionText, now)
      : [];

    // ── Solutions
    const { sampleSolution, sampleStockSolution, solutions } = this.epDetectSolutions(sectionText);

    const refMap = new Map(solutions.map(s => [s.label, s.text]));

    const standardSolution = refMap.get('Reference solution (a)') ?? '';
    const systemSuitabilitySolution = refMap.get('Reference solution (b)') ?? '';
    const sensitivitySolution = refMap.get('Reference solution (c)') ?? '';
    const otherSolution = refMap.get('Reference solution (d)') ?? '';

    // ── System Suitability
    const suitability = this.epDetectSystemSuitability(sectionText);
    const systemSuitabilitySample = suitability['systemSuitabilitySample']
      ?? 'Reference solution (a)';
    const suitabilityReqResolution = suitability['suitabilityReqResolution'] ?? '';
    const systemSuitabilitySignalToNoiseRatio = suitability['systemSuitabilitySignalToNoiseRatio'] ?? '';

    // ── Run Time
    const runTimeMatch = sectionText.match(
      /Run\s+time\s*:\s*(.+?)(?=\s*(?:Identification|System\s+[Ss]uitability|Limits|$))/is
    );
    const runTime = runTimeMatch
      ? runTimeMatch[1].replace(/\s+/g, ' ').trim()
      : '';

    // ── Identification of Impurities
    const identImpMatch = sectionText.match(
      /Identification\s+of\s+impurities\s*:\s*(.+?)(?=\s*(?:General\s+Notices|Relative\s+retention|System\s+[Ss]uitability|$))/is
    );
    const identificationOfImpurities = identImpMatch
      ? identImpMatch[1].replace(/\s+/g, ' ').trim()
      : '';

    // Relative Retention Times
    const rrtMatch = sectionText.match(
      /Relative\s+retention\s+with\s+reference\s+to\s+\w+[^:]*:\s*(.+?)(?=\s*(?:System\s+[Ss]uitability|Limits|$))/is
    );
    const relativeRetention = rrtMatch
      ? rrtMatch[1].replace(/\s+/g, ' ').trim()
      : '';

    // Disregard Limit
    const disregardMatch = sectionText.match(
      /disregard\s+limit\s*:\s*[^(]*\(([\d.]+)\s*per cent\)/i
    );
    const disregardLimit = disregardMatch ? `${disregardMatch[1]}%` : '';

    // Impurity Details
    let impuritiesDetailsList: ImpuritiesDetails[] = [];

    if (testLabel && testLabel === 'ORGANIC IMPURITIES') {

      // Get Impurities Details
      impuritiesDetailsList = await this.epExtractImpurityDetails(impuritiesBlock, pdfFile);

    }

    const specifiedList = impuritiesDetailsList.filter(
      d => d.impurityType !== 'UNSPECIFIED IMPURITY'
    );

    // Unspecified Impurities
    let unspecifiedList: ImpuritiesUnspecified[] = []
    unspecifiedList = this.europeanExtractUnspecifiedImpurities(sectionText);

    // Analysis List
    const limitsBlock = sectionText.match(
      /Limits\s*:\s*(.+?)(?=\s*(?:Loss\s+on\s+drying|Sulfated\s+ash|ASSAY|STORAGE|$))/is
    );
    const limitsDescription = limitsBlock
      ? limitsBlock[1].replace(/\s+/g, ' ').trim()
      : '';

    const impuritiesAnalysisList = [];

    // Test Type
    const testType = detectorWavelength ? 'HPLC/UV' : 'CHROMATOGRAPHIC';

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
      columnStationaryPhase,
      flowRate,
      injectionVolumeAmount,
      runTime,
      diluent: '',
      standardSolution,
      systemSuitabilitySolution,
      sampleSolution,
      ...(sensitivitySolution
        ? { sensitivitySolution }
        : {}),
      ...(otherSolution
        ? { otherSolution }
        : {}),
      systemSuitabilitySample,
      ...(suitabilityReqResolution
        ? { suitabilityReqResolution }
        : {}),
      ...(systemSuitabilitySignalToNoiseRatio
        ? { systemSuitabilitySignalToNoiseRatio }
        : {}),
      comments: [
        identificationOfImpurities
          ? `Identification of impurities: ${identificationOfImpurities}`
          : '',
        relativeRetention
          ? `Relative retention: ${relativeRetention}`
          : '',
        disregardLimit
          ? `Disregard limit: ${disregardLimit}`
          : '',
      ].filter(Boolean).join(' | '),
      impuritiesSolutionList,
      impuritiesSolutionTableList,
      impuritiesAnalysisList,
      impuritiesDetailsList: specifiedList,
      impuritiesUnspecifiedList: unspecifiedList,
    };
  }

  europeanExtractUnspecifiedImpurities(text: string): ImpuritiesUnspecified[] {
    const unspecifiedList: ImpuritiesUnspecified[] = [];

    const normalized = text
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\s+/g, ' ');

    // Pattern 1: "unspecified impurities: ... (X per cent)"
    const pattern1 = /unspecified\s+impurities\s*:[^;]*\(([0-9.]+)\s*per\s+cent\)/gi;

    // Pattern 2: "unspecified impurities: ... maximum/not more than X per cent" (no parens)
    const pattern2 = /unspecified\s+impurities\s*:[^;]*(?:maximum|not\s+more\s+than)\s*([0-9.]+)\s*per\s+cent/gi;

    // Pattern 3: "any other impurity: ... (X per cent)"
    const pattern3 = /any\s+other\s+impurity\s*:[^;]*\(([0-9.]+)\s*per\s+cent\)/gi;

    // Pattern 4: "any other impurity: ... maximum/not more than X per cent" (no parens)
    const pattern4 = /any\s+other\s+impurity\s*:[^;]*(?:maximum|not\s+more\s+than)\s*([0-9.]+)\s*per\s+cent/gi;

    let match: RegExpExecArray | null;

    // Check pattern 1
    match = pattern1.exec(normalized);
    if (match) {
      unspecifiedList.push({
        impurityType: 'UNSPECIFIED IMPURITY',
        testType: 'HPLC/UV',
        limitValue: parseFloat(match[1]),
        limitType: 'NMT',
        unit: '%',
        comments: '',
        identityCriteriaList: []
      });
    }

    // Check pattern 2
    pattern2.lastIndex = 0;
    match = pattern2.exec(normalized);
    if (match) {
      unspecifiedList.push({
        impurityType: 'UNSPECIFIED IMPURITY',
        testType: 'HPLC/UV',
        limitValue: parseFloat(match[1]),
        limitType: 'NMT',
        unit: '%',
        comments: '',
        identityCriteriaList: []
      });
    }

    // Check pattern 3
    pattern3.lastIndex = 0;
    match = pattern3.exec(normalized);
    if (match) {
      unspecifiedList.push({
        impurityType: 'UNSPECIFIED IMPURITY',
        testType: 'HPLC/UV',
        limitValue: parseFloat(match[1]),
        limitType: 'NMT',
        unit: '%',
        comments: '',
        identityCriteriaList: []
      });
    }

    // Check pattern 4
    pattern4.lastIndex = 0;
    match = pattern4.exec(normalized);
    if (match) {
      unspecifiedList.push({
        impurityType: 'UNSPECIFIED IMPURITY',
        testType: 'HPLC/UV',
        limitValue: parseFloat(match[1]),
        limitType: 'NMT',
        unit: '%',
        comments: '',
        identityCriteriaList: []
      });
    }

    // Deduplicate by limitValue in case multiple patterns matched the same entry
    const seen = new Set<number>();
    return unspecifiedList.filter(item => {
      if (seen.has(item.limitValue as number)) return false;
      seen.add(item.limitValue as number);
      return true;
    });
  }



  epDetectChromatographicParams(sectionText: string): {
    flowRate: string;
    detectorWavelength: string;
    injectionVolumeAmount: string;
    autosamplerTemperature: string;
  } {

    // EP format has spaces before colons: "Flow rate : 1 mL/min."
    // Also handles: "Flow rate: 1 mL/min." (no space before colon)

    // Flow rate
    // Handles: "1 mL/min"  "0.6 mL/min"  "1 ml/min"
    const flowMatch = sectionText.match(
      /Flow\s+rate\s*:\s*([\d.]+\s*m[lL]\/min)/i
    );

    // Detection
    // Handles: "spectrophotometer at 280 nm"
    //          "spectrophotometer at 254 nm"
    //          "UV at 280 nm" (some EP monographs)
    const detMatch = sectionText.match(
      /Detection\s*:\s*(?:spectrophotometer\s+at|UV\s+at|UV\s*)\s*([\d]+)\s*nm/i
    );

    // Injection
    // Handles: "40 μL"  "20 µL"  "40 uL"
    const injMatch = sectionText.match(
      /Injection\s*:\s*([\d.]+\s*[uµμ]L)/i
    );

    // Autosampler temperature
    // EP occasionally specifies: "Temperature : 4 °C"
    // Not present in Omeprazole but handle for other monographs
    const tempMatch = sectionText.match(
      /(?:Autosampler\s+)?[Tt]emperature\s*:\s*([\d]+\s*°\s*C)/i
    );

    // Column temperature
    // EP format: "– column : 40 °C" inside Column block
    const colTempMatch = sectionText.match(
      /–\s*column\s*:\s*([\d]+\s*°\s*C)/i
    );

    return {
      flowRate: flowMatch
        ? flowMatch[1].trim().replace(/\bml\b/g, 'mL')
        : '',

      detectorWavelength: detMatch
        ? `${detMatch[1]} nm`
        : '',

      injectionVolumeAmount: injMatch
        ? injMatch[1]
          .replace(/\bu\b/g, 'µ')   // normalize "uL" → "µL"
          .replace(/\bμ\b/g, 'µ')   // normalize "μL" → "µL"
          .trim()
        : '',

      autosamplerTemperature: tempMatch
        ? tempMatch[1].replace(/\s+/g, '').trim()
        : colTempMatch
          ? colTempMatch[1].replace(/\s+/g, '').trim()
          : '',
    };
  }


  epDetectColumn(sectionText: string): {
    columnSize: string;
    columnPackingSize: string;
    columnPackingType: string;
    columnTemperature: string;
    columnStationaryPhase: string;
  } {

    // Column block — slice from "Column" to next section keyword
    const columnBlockMatch = sectionText.match(
      /Column\s*:\s*([\s\S]+?)(?=\s*(?:Mobile\s+phase|Flow\s+rate|Detection|Injection|Run\s+time|System\s+[Ss]uitability|Limits|$))/i
    );

    const columnBlock = columnBlockMatch ? columnBlockMatch[1] : sectionText;

    // Size: extract as-is without conversion
    const sizeMatch = columnBlock.match(
      /size\s*:\s*[l1]\s*=\s*([\d.]+\s*m)[,;]?\s*[OØ@Ø°]\s*=\s*([\d.]+\s*mm)/i
    );

    let columnSize = '';
    if (sizeMatch) {
      const length = sizeMatch[1].trim();
      const diameter = sizeMatch[2].trim();
      columnSize = `${diameter} × ${length}`;
    }

    const columnPackingSize = '';
    const columnPackingType = '';

    // Temperature
    const tempMatch = columnBlock.match(
      /[-–]?\s*temperature\s*:\s*([\d.]+\s*°?\s*C)/i
    );
    const columnTemperature = tempMatch
      ? tempMatch[1].replace(/\s+/g, '').replace(/°?C/i, '°C')
      : '';

    // Stationary phase: extract everything after "stationary phase:" up to the semicolon
    const stationaryMatch = columnBlock.match(
      /stationary\s+phase\s*:\s*([^;]+)/i
    );
    const columnStationaryPhase = stationaryMatch
      ? stationaryMatch[1].trim()
      : '';

    return {
      columnSize,
      columnPackingSize,
      columnPackingType,
      columnTemperature,
      columnStationaryPhase,
    };
  }



  epDetectSystemSuitability(sectionText: string): { [key: string]: string } {
    const blockMatch = sectionText.match(
      /System\s+[Ss]uitability\s*[:\s]*(.+?)(?=\s*(?:Limits\s*:|Calculation\s+of\s+percentage|Identification\s+of\s+impurities|Loss\s+on\s+drying|Sulfated\s+ash|Water\s+\(|ASSAY|$))/is
    );

    if (!blockMatch) return {
      suitabilityReqResolution: '',
      systemSuitabilitySignalToNoiseRatio: '',
      systemSuitabilitySample: '',
      comments: ''
    };

    const block = blockMatch[1];

    // Extract sample - look for reference solution immediately after the colon
    const sampleMatch = block.match(/^[^:]*:\s*(reference\s+solution\s*\([a-z]\))/i);

    const sample = sampleMatch ? sampleMatch[1].trim() : '';

    // Extract resolution
    const resMatch = block.match(/resolution\s*:\s*(.+?)(?=\s*[-–]\s*(?:signal|peak|symmetry)|$)/is);

    // Extract peak-to-valley ratio
    const ptvMatch = block.match(/peak-to-valley\s+ratio\s*:\s*(.+?\.)/is);

    // Extract signal-to-noise ratio
    const snMatch = block.match(/signal[\s-]to[\s-]noise\s+ratio\s*:\s*minimum\s*([\d.]+)/i);

    const cleanBlock = block.replace(/\s+/g, ' ').trim();

    // Priority: peak-to-valley > resolution
    const suitabilityText = ptvMatch
      ? ptvMatch[1].replace(/\s+/g, ' ').trim()
      : (resMatch ? resMatch[1].replace(/\s+/g, ' ').trim() : '');

    return {
      suitabilityReqResolution: suitabilityText,
      systemSuitabilitySignalToNoiseRatio: snMatch
        ? `NLT ${snMatch[1]}`
        : '',
      systemSuitabilitySample: sample,
      comments: sample ? `System suitability: ${sample}:` : `System suitability: ${cleanBlock}`
    };
  }


  /******************************************************************************** */

  async epExtractImpurityDetails(
    text: string,
    pdfFile?: File
  ): Promise<ImpuritiesDetails[]> {

    /**** BEGIN STRUCTURE  */

    // Extract structures from PDF
    const structures = await this.epExtractImpurityStructures(text);

    // Reset once, before the loop
    this.debugStructureImages = [];

    for (const structure of structures) {

      if (pdfFile) {
        const blob = await this.extractStructureImages(pdfFile, structure.impurityCode);
        if (blob) {
          const url = URL.createObjectURL(blob);
          this.debugStructureImages.push({ code: structure.impurityCode, url });
        } else {
          console.warn(`[DEBUG] No blob for impurity ${structure.impurityCode}`);
        }
      }
    }

    /***** END STRUCTURE  */

    // ── Build a quick lookup: impurity letter → structure image URL ──────
    const structureImageUrlMap = new Map<string, string>(
      this.debugStructureImages.map(entry => [entry.code, entry.url])
    );

    const result: ImpuritiesDetails[] = [];

    await this.getExistingImpuritiesFromSubstance(0);


    // Find Impurity B section
    const impBMatch = text.match(/\bB\.\s+4-O-[^\n]{0,200}/);
    if (impBMatch) {
      const hasApostrophe = /['']/.test(impBMatch[0]);
      const hasAsterisk = /\*/.test(impBMatch[0]);
    }

    // Find IMPURITIES section
    const impuritiesIdx = text.search(/\bIMPURITIES\b/i);

    if (impuritiesIdx === -1) {
      if (this.existingImpurities?.length > 0) {
        for (const existing of this.existingImpurities) {
          result.push({
            relatedSubstanceUuid: existing.relationshipUuid,
            relatedSubstanceUnii: existing.relationshipUnii,
            substanceName: existing.relationshipName,
            impurityType: 'SPECIFIED IMPURITY',
            testType: '',
            sourceImpurityName: '',
            limitType: '',
            unit: ''
          });
        }
      }
      return result;
    }

    // Extract IMPURITIES section to end
    let impuritiesText = text.substring(impuritiesIdx);

    // Minimal cleaning - preserve structure
    impuritiesText = impuritiesText
      .replace(/<\s*OCR_Content\s*>/gi, '')
      .replace(/<\s*\/\s*OCR_Content\s*>/gi, '')
      .replace(/The following is OCR text extracted[^\n]*/gi, '')
      .replace(/Correct the errors in the following[^\n]*/gi, '')
      .replace(/EUROPEAN\s+PHARMACOPOEIA\.?\s+\d{2}\/\d{4}:\d{4}\s+Amikacin\s+sulfate\s+/gi, '')
      .replace(/^EUROPEAN\s+PHARMACOPOEIA\.?\s+\d{2}\/\d{4}:\d{4}\s*$/gm, '')
      .replace(/^Amikacin\s+sulfate\s*$/gm, '')
      .replace(/^General\s+Notices\s+apply\s+to\s+all\s+monographs[^\n]*$/gm, '');


    // Find all impurity letter labels
    const boundaryRe = /([A-I])\.\s+/gm;
    const allMatches = [...impuritiesText.matchAll(boundaryRe)];

    if (allMatches.length === 0) {
      console.warn('No impurity letter labels (A-I) found');
      if (this.existingImpurities?.length > 0) {
        for (const existing of this.existingImpurities) {
          result.push({
            relatedSubstanceUuid: existing.relationshipUuid,
            relatedSubstanceUnii: existing.relationshipUnii,
            substanceName: existing.relationshipName,
            impurityType: 'SPECIFIED IMPURITY',
            testType: '',
            sourceImpurityName: '',
            limitType: '',
            unit: ''
          });
        }
      }
      return result;
    }

    // Extract each impurity definition
    const pdfImpurityMap: Record<string, {
      letter: string;
      sourceImpurityName: string;
      alternateName: string;
      limitValue?: number;
      limitType?: string;
      unit?: string;
      relativeRetentionTime?: number;
      comments: string[];
    }> = {};

    for (let i = 0; i < allMatches.length; i++) {
      const match = allMatches[i];
      const letter = match[1];

      const blockStart = match.index! + match[0].length;
      const nextMatch = allMatches[i + 1];
      const blockEnd = nextMatch ? nextMatch.index! : impuritiesText.length;

      let rawBlock = impuritiesText.slice(blockStart, blockEnd);

      const lines = rawBlock.split('\n');
      let chemicalName = '';

      for (const line of lines) {
        let cleaned = line.trim();
        if (!cleaned) continue;
        if (/^EUROPEAN\s+PHARMACOPOEIA/i.test(cleaned)) break;
        if (/^Amikacin\s+sulfate\s*$/i.test(cleaned)) break;
        if (/^General\s+Notices/i.test(cleaned)) break;
        if (/^[A-Z]{1,2}\s*$/.test(cleaned) && !/[',*\-0-9]/.test(cleaned)) break;
        if (/^[HO\s\-°.,()NH]+$/.test(cleaned) && cleaned.length < 10) break;

        cleaned = cleaned
          .replace(/EUROPEAN\s+PHARMACOPOEIA[^\n]*/gi, '')
          .replace(/\d{2}\/\d{4}:\d{4}/g, '')
          .replace(/Amikacin\s+sulfate/gi, '')
          .trim();

        if (!cleaned) continue;

        if (chemicalName && chemicalName.endsWith('-')) {
          chemicalName += cleaned;
        } else {
          chemicalName += (chemicalName ? ' ' : '') + cleaned;
        }

        if (/[,.]$/.test(cleaned)) break;
      }

      chemicalName = chemicalName.replace(/[,.]$/, '').trim();
      chemicalName = chemicalName.replace(/\s+/g, ' ').trim();
      chemicalName = chemicalName.replace(/\s+-/g, '-');
      chemicalName = chemicalName.replace(/-\s+/g, '-');
      chemicalName = chemicalName.replace(/\(\s+/g, '(');
      chemicalName = chemicalName.replace(/\s+\)/g, ')');
      chemicalName = chemicalName.replace(/\((\d+)\s+([A-Z])\)/g, '($1$2)');
      chemicalName = chemicalName.replace(/([A-Z])(\d+)\s+/g, '$1$2');
      chemicalName = chemicalName.replace(/\s+([A-Z])(\d+)/g, '$1$2');
      chemicalName = chemicalName.replace(/([A-Z])\s+(\d+)/g, '$1$2');
      chemicalName = chemicalName.replace(/([A-Z])\s+(['*])/g, '$1$2');
      chemicalName = chemicalName.replace(/([',])\s+/g, '$1');

      if (chemicalName.length < 10) continue;

      let alternateName = '';
      const altMatch = chemicalName.match(/\(([a-z][a-z\s]{2,30})\)\s*$/i);
      if (
        altMatch &&
        !/\d/.test(altMatch[1]) &&
        !/deoxy|amino|gluco|pyrano|hydroxy|strept|butan|dideoxy|diamino/i.test(altMatch[1])
      ) {
        alternateName = altMatch[1].trim();
        chemicalName = chemicalName.slice(0, chemicalName.length - altMatch[0].length).trim();

      }

      pdfImpurityMap[letter] = {
        letter,
        sourceImpurityName: chemicalName,
        alternateName: alternateName || '',
        limitType: 'NMT',
        comments: []
      };
    }

    // Extract limits from TESTS section
    const limitsPattern = /impurit(?:y|ies)\s+([A-Z](?:\s*,\s*[A-Z])*)\s*:.*?(?:maximum|for\s+each\s+impurity,\s+maximum)\s+([\d.]+)\s*per\s*cent/gi;
    let match: RegExpExecArray | null;

    while ((match = limitsPattern.exec(text)) !== null) {
      const limitValue = parseFloat(match[2]);
      const letters = match[1].split(/\s*,\s*/).map(l => l.trim());
      for (const lt of letters) {
        if (pdfImpurityMap[lt] && pdfImpurityMap[lt].limitValue === undefined) {
          pdfImpurityMap[lt].limitValue = limitValue;
          pdfImpurityMap[lt].limitType = 'NMT';
          pdfImpurityMap[lt].unit = '%';
        }
      }
    }

    // Extract relative retention times
    const rrPattern = /impurity\s+([A-Z])\s*=\s*about\s+([\d.]+)/gi;
    while ((match = rrPattern.exec(text)) !== null) {
      const lt = match[1];
      const rrt = parseFloat(match[2]);
      if (pdfImpurityMap[lt]) {
        pdfImpurityMap[lt].relativeRetentionTime = rrt;
      }
    }

    // Extract identification instructions
    const idPattern = /(use the chromatogram[^;.]+to identify the peak(?:s)? due to impurit(?:y|ies)\s+([A-Z](?:\s*(?:,|and)\s*[A-Z])*))/gi;
    while ((match = idPattern.exec(text)) !== null) {
      const phrase = match[1].trim();
      const formatted = phrase.charAt(0).toUpperCase() + phrase.slice(1);
      const letters = match[2].split(/\s*(?:,|and)\s*/).map(l => l.trim());
      for (const lt of letters) {
        if (pdfImpurityMap[lt]) {
          pdfImpurityMap[lt].comments.push(formatted);
        }
      }
    }

    // Match with existing substance relationships
    const existingByName = new Map<string, any>();
    if (this.existingImpurities?.length > 0) {
      for (const existing of this.existingImpurities) {
        if (existing.relationshipName) {
          const normalized = existing.relationshipName.trim().toUpperCase();
          existingByName.set(normalized, existing);
        }
      }
    }

    const normalizeForMatch = (name: string): string => {
      return name
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/-/g, '')
        .replace(/['']/g, "'")
        .replace(/α/g, 'A')
        .replace(/β/g, 'B');
    };

    const findExisting = (chemName: string, altName: string): any => {
      const chemUpper = chemName.toUpperCase();
      const altUpper = altName.toUpperCase();
      let match = existingByName.get(chemUpper) ?? existingByName.get(altUpper);
      if (!match) {
        const chemNorm = normalizeForMatch(chemName);
        const altNorm = altName ? normalizeForMatch(altName) : '';
        for (const [existingName, existingRel] of existingByName.entries()) {
          const existingNorm = normalizeForMatch(existingName);
          if (existingNorm === chemNorm || (altNorm && existingNorm === altNorm)) {
            match = existingRel;
            break;
          }
        }
      }
      return match;
    };

    // Build final result list
    const processedExistingUuids = new Set<string>();

    for (const [letter, pdfData] of Object.entries(pdfImpurityMap)) {
      const existingRel = findExisting(
        pdfData.sourceImpurityName,
        pdfData.alternateName
      );

      if (existingRel?.relationshipUuid) {
        processedExistingUuids.add(existingRel.relationshipUuid);
      }

      // Look up the structure image URL for this impurity letter
      const sourceImpurityStructureUrl = structureImageUrlMap.get(letter);

      result.push({
        relatedSubstanceUuid: existingRel?.relationshipUuid,
        relatedSubstanceUnii: existingRel?.relationshipUnii,
        substanceName: existingRel?.relationshipName,
        sourceImpurityName: pdfData.sourceImpurityName,
        impurityType: 'SPECIFIED IMPURITY',
        testType: 'ORGANIC IMPURITIES',
        limitValue: pdfData.limitValue,
        limitType: pdfData.limitType,
        unit: pdfData.unit,
        comments: pdfData.comments.length > 0
          ? pdfData.comments.join('. ')
          : undefined,
        identityCriteriaList: pdfData.relativeRetentionTime
          ? [{
            identityCriteriaType: 'Relative retention time',
            amountValue: pdfData.relativeRetentionTime.toString()
          }]
          : undefined,
        _sourceImpurityStructureImage: sourceImpurityStructureUrl
      } as ImpuritiesDetails);
    }

    // Add ONLY unmatched existing relationships
    if (this.existingImpurities?.length > 0) {
      for (const existing of this.existingImpurities) {
        if (existing.relationshipUuid && processedExistingUuids.has(existing.relationshipUuid)) {
          continue;
        }
        result.push({
          relatedSubstanceUuid: existing.relationshipUuid,
          relatedSubstanceUnii: existing.relationshipUnii,
          substanceName: existing.relationshipName,
          impurityType: 'SPECIFIED IMPURITY',
          testType: '',
          sourceImpurityName: '',
          limitType: '',
          unit: ''
        });
      }
    }

    return result;
  }


  /********************************************************************** */
  epExtractTotal(text: string, fullText?: string): any { // Adjust return type to your ImpuritiesTotal interface
    const searchText = text + (fullText ? ' ' + fullText : '');
    const result: any = {};
    const commentsArr: string[] = [];

    // Extract Total Limit Value
    const parenMatch = searchText.match(/[–\-]\s*total\s*:\s*[\s\S]+?\(([\d.]+)\s*per\s*cent\)/i);
    const maxMatch = searchText.match(/[–\-]\s*total\s*:\s*(?:not\s+more\s+than\s+|maximum\s+)([\d.]+)\s*per\s*cent/i);

    if (parenMatch) {
      result.limitValue = parenMatch[1];
      result.limitType = 'NMT';
      result.unit = '%';
    } else if (maxMatch) {
      result.limitValue = maxMatch[1];
      result.limitType = 'NMT';
      result.unit = '%';
    }

    // Extract full text for Total Limit to append to comments
    const totalTextMatch = searchText.match(/[–\-]\s*(total\s*:\s*[^;.]+?\([\d.]+\s*per\s*cent\))/i);
    if (totalTextMatch) {
      commentsArr.push(totalTextMatch[1].trim().charAt(0).toUpperCase() + totalTextMatch[1].trim().slice(1));
    }

    // Extract full text for Disregard Limit to append to comments
    const disregardMatch = searchText.match(/[–\-]\s*(disregard\s*limit\s*:\s*[^;.]+?\([\d.]+\s*per\s*cent\))/i);
    if (disregardMatch) {
      commentsArr.push(disregardMatch[1].trim().charAt(0).toUpperCase() + disregardMatch[1].trim().slice(1));
    }

    if (commentsArr.length > 0) {
      result.comments = commentsArr.join('. ');
    }

    return result;
  }

  epExtractInorganicImpurities(
    text: string,
    source: string,
    sourceType: string,
    sourceId: string
  ): ImpuritiesInorganicTest[] {

    const test = '';

    // EP format:
    // "Sulfated ash (2.4.14) : maximum 0.1 per cent, determined on 1.0 g."
    // USP equivalent: "Residue on Ignition (281): NMT 0.1%"
    const match = text.match(
      /Sulfated\s+ash\s*(?:\([^)]+\))?\s*:\s*(maximum\s+[\d.]+\s*per\s*cent[\s\S]*?)(?=\s*(?:Loss\s+on\s+drying|Water\s+\(|ASSAY|STORAGE|Related\s+substances|$))/i
    );

    if (!match) return [];

    const fullDescription = match[1].replace(/\s+/g, ' ').trim();
    const limitMatch = fullDescription.match(/([\d.]+)\s*per\s*cent/i);
    const limitValue = limitMatch ? limitMatch[1] : '';

    return [{
      sourceType,
      source,
      sourceId,
      test,
      testType: '',
      impuritiesInorganicList: [{
        substanceName: '',
        limitValue,
        limitType: 'NMT',
        unit: '%',
        testType: 'Sulfated Ash (2.4.14)',
        comments: fullDescription,
      }],
    }];
  }

  epExtractResidualSolventsTest(
    text: string,
    source: string,
    sourceType: string,
    sourceId: string
  ): ImpuritiesResidualSolventsTest[] {

    const now = Date.now();

    const match = text.match(
      /Loss\s+on\s+drying\s*(?:\([^)]+\))?\s*:\s*(maximum\s+[\d.]+\s*per\s*cent[\s\S]+?)(?=\s*(?:Sulfated\s+ash|Water\s+\(|ASSAY|STORAGE|$))/i
    );

    if (!match) return [];

    const fullDescription = match[1].replace(/\s+/g, ' ').trim();

    const limitMatch = fullDescription.match(/([\d.]+)\s*per\s*cent/i);
    const limitValue = limitMatch ? parseFloat(limitMatch[1]) : 0;

    return [{
      sourceType,
      source,
      sourceId,
      test: '',
      testType: '',
      impuritiesResidualSolventsList: [{
        substanceName: '',
        limitValue,
        limitType: 'NMT',
        unit: '%',
        pharmaceuticalLimit: '',
        testType: 'Loss on Drying',
        analysis: fullDescription,
        comments: ''
      }],
    }];
  }

  private epDetectSolutions(sectionText: string): {
    sampleSolution: string;
    sampleStockSolution: string;
    solutions: Array<{ label: string; text: string }>;
  } {
    const result = {
      sampleSolution: '',
      sampleStockSolution: '',
      solutions: [] as Array<{ label: string; text: string }>,
    };

    // Find all reference solution label positions
    const labelRegex = /(?:^|\.\s+|\n)Reference\s+solution\s*\(([a-z])\)\s*\.?\s*/gm;
    const allPositions: Array<{ label: string; start: number; contentStart: number }> = [];

    let labelMatch: RegExpExecArray | null;
    while ((labelMatch = labelRegex.exec(sectionText)) !== null) {
      const prefixLen = labelMatch[0].search(/Reference/i);
      const refStart = labelMatch.index + prefixLen;
      const contentStart = labelMatch.index + labelMatch[0].length;
      allPositions.push({
        label: `Reference solution (${labelMatch[1]})`,
        start: refStart,
        contentStart,
      });
    }


    // Deduplicate — keep first occurrence of each letter
    const seen = new Set<string>();
    const uniquePositions = allPositions.filter(p => {
      if (seen.has(p.label)) return false;
      seen.add(p.label);
      return true;
    });


    // Find chromatographic boundary AFTER last label's contentStart
    // Only match keywords that appear as standalone section headers (preceded by ". " or start of string)
    // Excludes "mobile phase" and "flow rate" which appear inside solution sentences
    const minSearchFrom = uniquePositions.length > 0
      ? uniquePositions[uniquePositions.length - 1].contentStart
      : 0;

    const chromRegex = /(?:^|\.\s+|\n\s*)(?:Column|Detection|Injection|Chromatographic\s+system|System\s+suitability)\s*[:–\-]/gi;
    let solutionSectionEnd = sectionText.length;
    let chromMatch: RegExpExecArray | null;
    while ((chromMatch = chromRegex.exec(sectionText)) !== null) {
      if (chromMatch.index >= minSearchFrom) {
        // Walk forward to the actual keyword start (skip leading ". " or "\n")
        const kwOffset = chromMatch[0].search(/Column|Detection|Injection|Chromatographic|System/i);
        solutionSectionEnd = chromMatch.index + kwOffset;
        break;
      }
    }

    const solutionText = sectionText.substring(0, solutionSectionEnd);

    // Test solution
    const testSolMatch = solutionText.match(
      /Test\s+solution\s*\.?\s*([\s\S]+?)(?=\s*Reference\s+solution\s*\([a-z]\)\s*\.|$)/i
    );
    if (testSolMatch) result.sampleSolution = testSolMatch[1].trim();

    // Stock solution
    const stockSolMatch = solutionText.match(
      /(?:Sample\s+)?[Ss]tock\s+solution\s*\.?\s*([\s\S]+?)(?=\s*(?:Test|Reference)\s+solution\s*|$)/i
    );
    if (stockSolMatch) result.sampleStockSolution = stockSolMatch[1].trim();


    // Slice content between labels
    const validPositions = uniquePositions.filter(p => p.start < solutionSectionEnd);

    for (let i = 0; i < validPositions.length; i++) {
      const contentEnd =
        i + 1 < validPositions.length
          ? validPositions[i + 1].start
          : solutionSectionEnd;
      const rawText = solutionText
        .substring(validPositions[i].contentStart, contentEnd)
        .trim();
      const label = validPositions[i].label;

      result.solutions.push({ label, text: `${label} ${rawText}` });
    }

    result.solutions.sort((a, b) => a.label.localeCompare(b.label));
    return result;
  }



  /* MOBILE PHASE */
  epExtractMobilePhaseSolution(sectionText: string, now: number): ImpuritiesSolution[] {
    const solutions: ImpuritiesSolution[] = [];

    const mpMatch = sectionText.match(
      /Mobile\s+phase\s*:\s*(.+?)(?=\s*(?:Flow\s+rate|Detection|Injection|Run\s+time|System\s+[Ss]uitability|Limits|Column(?!\s+effluent)|Buffer(?:\s+solution)?\s*:|$))/is
    );

    if (!mpMatch) {
      return solutions;
    }

    const mpText = mpMatch[1];

    // Extract individual mobile phase solutions (A, B, C, etc.)
    const solutionPattern = /-?\s*mobile\s+phase\s+([A-J])\s*:\s*(.+?)(?=\s*-?\s*mobile\s+phase\s+[A-J]\s*:|Time\s*\(min\)|Flow\s+rate|$)/gis;

    let match;
    let id = 1;

    while ((match = solutionPattern.exec(mpText)) !== null) {
      const letter = match[1].toUpperCase();

      let description = match[2]
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[;\s\-–—]+$/g, '')   // ← removes trailing ; degas ; – and variants
        .trim();

      if (description.length > 2) {
        solutions.push({
          id: id++,
          solutionLetter: letter,
          solutionDescription: description
        });
      }

    }

    // Fallback: no lettered solutions found — treat as simple isocratic description
    if (solutions.length === 0) {
      const simpleDesc = mpText
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\.\s*$/, '');

      if (
        simpleDesc.length > 2 &&
        !simpleDesc.match(/Time\s*\(min\)/) &&
        !simpleDesc.match(/per\s+cent\s+V\/V/)
      ) {
        solutions.push({
          id: 1,
          solutionLetter: 'A',
          solutionDescription: simpleDesc
        });
      }
    }

    return solutions;
  }



  epDetectMobilePhaseTable(sectionText: string): string {

    const match = sectionText.match(
      /Mobile\s+phase\s*:\s*(.+?)(?=\s*(?:Buffer(?:\s+solution)?\s*:|Flow\s+rate|Detection|Injection|Run\s+time|System\s+[Ss]uitability|Limits|Column(?!\s+effluent)|Identification\s+of\s+impurities|General\s+Notices|$))/is
    );

    if (!match) return 'ISOCRATIC';

    const mpText = match[1]
      .replace(/\s+/g, ' ')
      .replace(/\.\s*$/, '')
      .trim();

    // Detect gradient table by presence of "Time (min)" header
    // Handles both inline and multi-line table formats from any monograph PDF
    const hasGradientTable = /Time\s*\(min\)|Mobile\s+phase\s+[A-J]\s*\(per\s+cent\s+V\/V\)/i.test(mpText);

    return hasGradientTable ? 'GRADIENT' : 'ISOCRATIC';
  }

  epExtractMobilePhaseTableRows(sectionText: string, now: number): ImpuritiesSolutionTable[] {
    const tables: ImpuritiesSolutionTable[] = [];

    const tableMatch = sectionText.match(
      /Time(?:\s*\([^)]+\))?([\s\S]+?)(?=Flow\s+rate|Detection|Injection|Run\s+time|System\s+[Ss]uitability|Limits|Column(?!\s+effluent)|Buffer(?:\s+solution)?\s*:|$)/i
    );

    if (!tableMatch) {
      console.warn('epExtractMobilePhaseTableRows: no table block found');
      return tables;
    }

    const rawBlock = tableMatch[1];

    // --- Extract column headers ---
    let solutionAHeader: string | undefined;
    let solutionBHeader: string | undefined;

    const mobilePhaseAMatch = sectionText.match(
      /Mobile\s+phase\s+A\s*\n?\s*\(([^)]+)\)/i
    );
    const mobilePhaseBMatch = sectionText.match(
      /Mobile\s+phase\s+B\s*\n?\s*\(([^)]+)\)/i
    );

    if (mobilePhaseAMatch) {
      solutionAHeader = `Mobile phase A (${mobilePhaseAMatch[1].trim()})`;
    }
    if (mobilePhaseBMatch) {
      solutionBHeader = `Mobile phase B (${mobilePhaseBMatch[1].trim()})`;
    }

    const normalised = rawBlock
      .replace(/→|→|->/g, 'ARROW')
      .replace(/\s+/g, ' ')
      .trim();

    // Split on time-range boundaries: e.g. "38.0 - 38.1", "0 to 3"
    const segments = normalised
      .split(/(?=(?:^|\s)\d+(?:\.\d+)?\s*(?:[-–]|to)\s*\d+(?:\.\d+)?(?:$|\s))/i)
      .map(s => s.trim())
      .filter(Boolean);

    let id = 1;

    for (const segment of segments) {
      const headerMatch = segment.match(
        /^(\d+(?:\.\d+)?(?:\s*(?:[-–]|to)\s*\d+(?:\.\d+)?)?)\s+(.+)$/i
      );

      if (!headerMatch) continue;

      const timeString = headerMatch[1];
      const valuesPart = headerMatch[2].trim();

      const tokens = valuesPart.split(/\s+/);
      const percentValues: (string | number)[] = [];

      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === 'ARROW') { i++; continue; }

        const val = parseFloat(tokens[i]);
        if (isNaN(val)) { i++; continue; }

        if (tokens[i + 1] === 'ARROW' && tokens[i + 2] !== undefined) {
          const endValStr = tokens[i + 2];
          percentValues.push(`${val} - ${endValStr}`);
          i += 3;
        } else {
          percentValues.push(val);
          i++;
        }
      }

      if (percentValues.length === 0) continue;

      let finalValues: (string | number)[] = [];
      const allNumbers = percentValues.every(v => typeof v === 'number');

      if (allNumbers && percentValues.length === 2) {
        const v1 = percentValues[0] as number;
        const v2 = percentValues[1] as number;

        if (Math.abs(v1 + v2 - 100) > 0.1) {
          const calcB = (val: number) => parseFloat((100 - val).toFixed(2));
          finalValues.push(`${v1} - ${v2}`);
          finalValues.push(`${calcB(v1)} - ${calcB(v2)}`);
        } else {
          finalValues.push(v1.toString());
          finalValues.push(v2.toString());
        }
      } else if (allNumbers && percentValues.length === 4) {
        const [a1, a2, b1, b2] = percentValues as number[];
        finalValues.push(`${a1} - ${a2}`);
        finalValues.push(`${b1} - ${b2}`);
      } else {
        finalValues = percentValues.map((v, idx) => {
          if (idx < 2 && typeof v === 'number') return v.toString();
          return v;
        });
      }

      const row: ImpuritiesSolutionTable = {
        id: id++,
        solutionTime: timeString,
        solutionAHeader,
        solutionBHeader,
        createDate: now,
        modifyDate: now,
      };

      const keys = [
        'solutionAPercent', 'solutionBPercent', 'solutionCPercent', 'solutionDPercent',
        'solutionEPercent', 'solutionFPercent', 'solutionGPercent', 'solutionHPercent',
        'solutionIPercent', 'solutionJPercent',
      ] as const;

      finalValues.forEach((val, idx) => {
        if (idx < keys.length) (row as any)[keys[idx]] = val;
      });

      tables.push(row);
    }

    return tables;
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

  async getExistingImpuritiesFromSubstance(substanceIndex: number): Promise<void> {
    return new Promise((resolve) => {

      if (!this.substanceUuid) {
        resolve();
        return;
      }

      const substanceUuid = this.substanceUuid;
      if (substanceUuid) {

        const getRelImpuritySubscribe = this.impuritiesService.getRelationshipImpurity(substanceUuid).subscribe({
          next: (response) => {

            if (response) {
              const relImpurities = response;
              if (Object.keys(relImpurities).length > 0) {
                // Remove Duplicate Impurites Substance UUID
                this.existingImpurities = relImpurities.filter((v, i) => relImpurities.findIndex
                  (item => item.relationshipUuid === v.relationshipUuid) === i);

                // Do something here 
              } else {
                this.errorMessage = 'No Impurities found';
              }
            }
            resolve();
          },
          error: (err) => {
            console.warn(`Could not find substance for: ${this.substanceUuid}`, err);
            resolve();   // ← resolve on error too — do not block mapping
          }
        });

        this.subscriptions.push(getRelImpuritySubscribe);
      }
    });
  }

  loadExistingImpurities(substanceIndex: number) {
    this.errorMessage = 'Found ' + this.existingImpurities.length + ' Existing Impurities';

    this.existingImpurities.forEach((elementRel) => {

      const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
      newImpuritiesDetails.relatedSubstanceUuid = elementRel.relationshipUuid;
      newImpuritiesDetails.relatedSubstanceUnii = elementRel.relationshipUnii;
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


  /** @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   * /******* EXTRACT CHEMICAL STRUCTURE *************************************************** */

  /**
  * Extract chemical structure information from European Pharmacopoeia PDF IMPURITIES section
  * Returns array of ImpurityStructure objects with chemical identifiers
  */
  async epExtractImpurityStructures(rawText: string): Promise<ImpurityStructure[]> {

    const structures: ImpurityStructure[] = [];

    // Find IMPURITIES section
    const impuritiesMatch = rawText.match(/\bIMPURITIES\b/i);
    if (!impuritiesMatch) {
      console.warn('IMPURITIES section not found');
      return structures;
    }

    const startIndex = impuritiesMatch.index!;
    let workingText = rawText.substring(startIndex);

    // Clean OCR artifacts and page headers
    workingText = workingText.replace(/<OCR_Content>/g, '');
    workingText = workingText.replace(/EUROPEAN PHARMACOPOEIA \d{2}\/\d{4}:\d+/g, '');
    workingText = workingText.replace(/General Notices apply to all monographs and other texts[^\n]*/g, '');
    workingText = workingText.replace(/See the information on general monographs \d+/g, '');

    // Normalize everything to a flat string (newlines or not, works either way)
    workingText = workingText.replace(/\s+/g, ' ').trim();
    workingText = workingText.replace(/\s*-\s*/g, '-');
    workingText = workingText.replace(/\(\s+/g, '(');
    workingText = workingText.replace(/\s+\)/g, ')');
    workingText = workingText.replace(/\[\s+/g, '[');
    workingText = workingText.replace(/\s+\]/g, ']');

    // Extract impurities — works on flat string, uses word boundary + lookahead
    // Matches "A. <content>" up to the next "B. " etc.
    const impurityPattern = /\b([A-I])\.\s+(.+?)(?=\s+[A-I]\.\s|\s*$)/gs;

    let match;

    while ((match = impurityPattern.exec(workingText)) !== null) {
      const impurityCode = match[1];
      let rawContent = match[2];

      const chemicalName = this.extractChemicalNameForStructure(rawContent);
      const alternateName = this.extractAlternateNameForStructure(rawContent);
      const molecularFormula = this.extractMolecularFormulaForStructure(rawContent);
      const casNumber = this.extractCASNumberForStructure(rawContent);

      const structure: ImpurityStructure = {
        impurityCode,
        chemicalName,
        alternateName: alternateName || '',
        molecularFormula,
        casNumber,
        structureRepresentation: '',
        smiles: null,
        inchi: null,
        inchiKey: null,
        molFile: null,
        pubchemCid: null,
        searchable: true
      };

      structures.push(structure);
    }

    // Enrich with chemical database lookups
    for (const structure of structures) {
      await this.enrichStructureData(structure);
    }

    return structures;
  }

  /**
   * Extract clean chemical name from raw impurity text
   * Removes page headers, footers, and trailing punctuation
   */
  private extractChemicalNameForStructure(rawContent: string): string {
    let name = rawContent;

    // Remove everything after terminal punctuation followed by uppercase (likely next section)
    name = name.replace(/[.,;]\s+[A-Z][a-z]+\s+[A-Z]/g, '');

    // Remove common name in parentheses at the end (we extract this separately)
    name = name.replace(/\s*\([a-z][a-z\s-]+\)\s*[.,;]?\s*$/i, '');

    // Remove trailing punctuation and whitespace
    name = name.replace(/[.,;]\s*$/, '').trim();

    // Remove any remaining page footer fragments
    name = name.replace(/\s+\d+\s*$/, '');

    return name;
  }

  /**
   * Extract alternate/common name from parentheses at end of impurity description
   */
  private extractAlternateNameForStructure(rawContent: string): string | null {
    // Look for lowercase name in parentheses at the end
    const match = rawContent.match(/\(([a-z][a-z\s-]+)\)\s*[.,;]?\s*$/i);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract molecular formula if present (format: C17H19N3O3S Mr 345.4)
   * European Pharmacopoeia typically doesn't include this in IMPURITIES section
   */
  private extractMolecularFormulaForStructure(rawContent: string): string | null {
    const match = rawContent.match(/\b([A-Z][a-z]?\d+)+\s+Mr\s+[\d.]+/);
    if (match) {
      return match[1];
    }
    return null;
  }

  /**
   * Extract CAS registry number if present (format: [12345-67-8])
   * European Pharmacopoeia typically doesn't include this in IMPURITIES section
   */
  private extractCASNumberForStructure(rawContent: string): string | null {
    const match = rawContent.match(/\[(\d{2,7}-\d{2}-\d)\]/);
    return match ? match[1] : null;
  }

  /**
   * Enrich structure data by searching chemical databases
   * Modifies the structure object in place
   */
  private async enrichStructureData(structure: ImpurityStructure): Promise<void> {

    // Search by IUPAC chemical name
    // Clean the name first - remove stereochemistry that might cause issues
    const simplifiedName = structure.chemicalName
      .replace(/\(2\s*[RS]\s*\)-/g, '') // Remove (2S)- or (2R)-
      .replace(/α-/g, 'alpha-')          // Replace Greek letters
      .replace(/β-/g, 'beta-')
      .replace(/\s+/g, ' ')
      .trim();

    // Priority 4: Try even more simplified name (remove all stereochemistry)
    const verySimplifiedName = simplifiedName
      .replace(/\([DLRS]\)-/g, '')       // Remove (D)-, (L)-, (R)-, (S)-
      .replace(/N\d+/g, 'N')             // N1 -> N
      .replace(/O\d+/g, 'O')             // O1 -> O
      .trim();
  }

  /**
   * Search PubChem by chemical name
   */
  private async searchPubChemByName(name: string): Promise<Partial<ImpurityStructure> | null> {
    try {
      // URL encode the name
      const encodedName = encodeURIComponent(name);
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodedName}/cids/JSON`;

      console.log(`Searching PubChem for: "${name}"`);

      const response = await fetch(url);

      if (!response.ok) {
        console.log(`PubChem search failed for "${name}": ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (!data.IdentifierList || !data.IdentifierList.CID || data.IdentifierList.CID.length === 0) {
        console.log(`No PubChem CID found for "${name}"`);
        return null;
      }

      const cid = data.IdentifierList.CID[0];
      console.log(`Found PubChem CID: ${cid} for "${name}"`);

      // Get compound data
      return await this.getCompoundDataFromPubChem(cid);

    } catch (error) {
      console.error(`Error searching PubChem for "${name}":`, error);
      return null;
    }
  }

  /**
   * Get compound structure data from PubChem by CID
   */
  private async getCompoundDataFromPubChem(cid: number): Promise<Partial<ImpurityStructure> | null> {
    try {
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/CanonicalSMILES,InChI,InChIKey/JSON`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Failed to get PubChem data for CID ${cid}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const props = data.PropertyTable.Properties[0];

      // Get MOL file
      const molUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF`;
      const molResponse = await fetch(molUrl);
      const molFile = molResponse.ok ? await molResponse.text() : null;

      console.log(`✓ Retrieved structure data for CID ${cid}`);

      return {
        smiles: props.CanonicalSMILES || null,
        inchi: props.InChI || null,
        inchiKey: props.InChIKey || null,
        molFile: molFile,
        pubchemCid: cid
      };

    } catch (error) {
      console.error(`Error getting PubChem data for CID ${cid}:`, error);
      return null;
    }
  }

  /**
   * Search by CAS number using NCI CACTUS resolver
   */
  private async searchByCAS(casNumber: string): Promise<Partial<ImpurityStructure> | null> {
    try {
      const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(casNumber)}/smiles`;

      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const smiles = await response.text();

      // Now search PubChem by SMILES to get full data
      const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/cids/JSON`;
      const pubchemResponse = await fetch(pubchemUrl);

      if (pubchemResponse.ok) {
        const pubchemData = await pubchemResponse.json();
        const cid = pubchemData.IdentifierList.CID[0];
        return await this.getCompoundDataFromPubChem(cid);
      }

      return { smiles };

    } catch (error) {
      console.error(`Error searching by CAS ${casNumber}:`, error);
      return null;
    }
  }


  /**
   * Search by molecular formula (can be combined with name matching)
   */
  private async searchByFormula(
    formula: string,
    name: string
  ): Promise<Partial<ImpurityStructure> | null> {
    try {
      // PubChem API endpoint
      const baseUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

      // Search by formula
      const searchUrl = `${baseUrl}/compound/formula/${encodeURIComponent(formula)}/cids/JSON`;
      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        return null;
      }

      const searchData = await searchResponse.json();
      const cids = searchData?.IdentifierList?.CID;

      if (!cids || cids.length === 0) {
        return null;
      }

      // Get first compound data (could add name matching to find best match)
      const cid = cids[0];

      return await this.getCompoundDataFromPubChem(cid);

    } catch (error) {
      console.error(`Error searching by formula ${formula}:`, error);
    }

    return null;
  }

  /**
   * Search by chemical name using REST API
   */
  private async searchByName(
    name: string,
    alternateName?: string
  ): Promise<Partial<ImpurityStructure> | null> {
    try {
      // Try primary name first
      let structureData = await this.searchPubChemByName(name);

      // If not found and alternate name exists, try alternate
      if (!structureData && alternateName) {
        structureData = await this.searchPubChemByName(alternateName);
      }

      return structureData;

    } catch (error) {
      console.error(`Error searching by name ${name}:`, error);
    }

    return null;
  }


  /************************************************************** */
  /**** EXTRACT CHEMICAL STRUCTURE AS IMAGE                       */
  /**** Extract structure images from European Pharmacopoeia PDF  */

  async extractStructureImages(pdfFile: File, impurityCode: string): Promise<Blob | null> {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const MIN_STRUCTURE_HEIGHT_PTS = 20;
    const scale = 5.0;
    const paddingPts = 6;
    const marginXPts = 20;

    // FIX: Set to 60. 85 was too aggressive and swallowed labels (A, E) and the tops of structures (B)
    const headerPts = 60;
    const footerPts = 60;

    const pageHeights: Record<number, number> = {};
    for (let p = 1; p <= pdf.numPages; p++) {
      const pg = await pdf.getPage(p);
      pageHeights[p] = pg.getViewport({ scale: 1.0 }).height;
    }

    let hasReachedImpurities = false;
    const rawItems: { page: number; x: number; y: number; w: number; h: number; text: string }[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const ph = pageHeights[pageNum];

      for (const item of textContent.items as any[]) {
        const str = (item.str ?? '').trim();
        if (!str) continue;

        if (!hasReachedImpurities) {
          if (/IMPURITIES/i.test(str)) hasReachedImpurities = true;
          continue;
        }

        // Skip page headers and footers (top/bottom 60pt)
        if (item.transform[5] > ph - headerPts || item.transform[5] < footerPts) continue;

        rawItems.push({
          page: pageNum,
          x: item.transform[4],
          y: item.transform[5],
          w: item.width ?? 0,
          h: item.height ?? 0,
          text: str
        });
      }
    }

    if (!hasReachedImpurities || rawItems.length === 0) {
      console.warn(`[IMG ${impurityCode}] EARLY EXIT`);
      return null;
    }

    // Merge tokens on the same line
    const allItems: typeof rawItems = [];
    for (const item of rawItems) {
      const prev = allItems[allItems.length - 1];
      const samePageAndLine =
        prev &&
        prev.page === item.page &&
        Math.abs(prev.y - item.y) < 2 &&
        (item.x - (prev.x + prev.w)) < 8;
      if (samePageAndLine) {
        prev.text += ' ' + item.text;
        prev.w = (item.x + item.w) - prev.x;
      } else {
        allItems.push({ ...item });
      }
    }

    // Find current label
    const labelPattern = new RegExp(`^${impurityCode}\\.`);
    let labelIdx = -1;
    for (let i = 0; i < allItems.length; i++) {
      if (labelPattern.test(allItems[i].text)) { labelIdx = i; break; }
    }

    if (labelIdx === -1) {
      console.warn(`[IMG ${impurityCode}] LABEL NOT FOUND`);
      return null;
    }

    const labelItem = allItems[labelIdx];
    const targetPage = labelItem.page;
    const pageHeight = pageHeights[targetPage];

    // Bottom boundary: just above the current label
    const bottomBoundary = {
      page: targetPage,
      y: labelItem.y + (labelItem.h || 11) + paddingPts
    };

    // Find previous label
    const prevLabelCode = String.fromCharCode(impurityCode.charCodeAt(0) - 1);
    const prevLabelPattern = new RegExp(`^${prevLabelCode}\\.`);
    let prevLabelIdx = -1;
    for (let i = labelIdx - 1; i >= 0; i--) {
      if (prevLabelPattern.test(allItems[i].text)) { prevLabelIdx = i; break; }
    }

    // Top boundary: bottom of previous impurity's name block
    let topBoundary: { page: number; y: number };

    if (prevLabelIdx === -1) {
      // Impurity A: find bottom of preamble text
      let preambleY: number | null = null;
      for (let i = labelIdx - 1; i >= 0; i--) {
        const c = allItems[i];
        if (c.page !== targetPage) break;
        if (c.y > labelItem.y && c.text.length > 20) {
          preambleY = c.y - paddingPts;
          break;
        }
      }
      topBoundary = {
        page: targetPage,
        y: preambleY ?? Math.min(labelItem.y + 350, pageHeight - headerPts)
      };
    } else {
      const prevLabelItem = allItems[prevLabelIdx];
      let bottomPage = prevLabelItem.page;
      let bottomY = prevLabelItem.y;

      // Gap detection to stop at the end of the text description
      for (let i = prevLabelIdx + 1; i < labelIdx; i++) {
        const c = allItems[i];

        if (c.page === bottomPage) {
          const gap = bottomY - c.y;

          if (gap < 0) continue;

          // A gap > 25pts means we've left the description paragraph and hit the structure
          if (gap > 25) {
            break;
          }

          bottomY = c.y;
        } else {
          // Crossed to next page. If it's a long string, it might be a description continuation.
          if (c.text.length > 15) {
            bottomPage = c.page;
            bottomY = c.y;
          } else {
            break; // Short string on a new page is likely an atom, stop here.
          }
        }
      }

      topBoundary = {
        page: bottomPage,
        y: bottomY - paddingPts
      };
    }

    // Render and crop
    if (topBoundary.page === bottomBoundary.page) {
      // Single page
      const pg = topBoundary.page;
      const ph = pageHeights[pg];
      const gapH = topBoundary.y - bottomBoundary.y;

      if (gapH < MIN_STRUCTURE_HEIGHT_PTS) {
        console.warn(`[IMG ${impurityCode}] GAP TOO SMALL (${gapH}pts)`);
        return null;
      }

      return await this._cropPageToBlob(pdf, pg, ph, topBoundary.y, bottomBoundary.y, scale, marginXPts);

    } else {
      // Cross-page stitch
      const topPg = topBoundary.page;
      const botPg = bottomBoundary.page;
      const topPh = pageHeights[topPg];
      const botPh = pageHeights[botPg];

      const renderPage = async (pgNum: number) => {
        const p = await pdf.getPage(pgNum);
        const vp = p.getViewport({ scale });
        const c = document.createElement('canvas');
        c.width = vp.width;
        c.height = vp.height;
        await p.render({ canvasContext: c.getContext('2d')!, viewport: vp, canvas: c }).promise;
        return { canvas: c, viewport: vp };
      };

      const { canvas: topCanvas, viewport: topVp } = await renderPage(topPg);
      const { canvas: botCanvas } = await renderPage(botPg);

      const cropX = marginXPts * scale;
      const cropW = topVp.width - cropX * 2;

      // from topBoundary.y down to the footer of the top page
      const topCropY = (topPh - topBoundary.y) * scale;
      const topCropH = (topBoundary.y - footerPts) * scale;

      // skip header zone, crop down to bottomBoundary.y
      const botCropY = headerPts * scale;
      const botCropH = (botPh - bottomBoundary.y) * scale - botCropY;

      if (cropW <= 0 || topCropH <= 0 || botCropH <= 0) {
        console.warn(`[IMG ${impurityCode}] Invalid stitch — falling back to bottom page only`);
        const fallbackTop = botPh - headerPts;
        const fallbackBot = bottomBoundary.y;
        if (fallbackTop - fallbackBot < MIN_STRUCTURE_HEIGHT_PTS) return null;
        return await this._cropPageToBlob(pdf, botPg, botPh, fallbackTop, fallbackBot, scale, marginXPts);
      }

      const totalH = Math.round(topCropH + botCropH);
      const out = document.createElement('canvas');
      out.width = Math.round(cropW);
      out.height = totalH;
      const ctx = out.getContext('2d')!;

      ctx.drawImage(topCanvas, cropX, topCropY, cropW, topCropH, 0, 0, cropW, topCropH);
      ctx.drawImage(botCanvas, cropX, botCropY, cropW, botCropH, 0, Math.round(topCropH), cropW, botCropH);

      // Trim whitespace before returning
      const trimmedOut = this._trimCanvasWhitespace(out);
      return new Promise(resolve => trimmedOut.toBlob(resolve, 'image/png'));
    }
  }

  private async _cropPageToBlob(
    pdf: any,
    pageNum: number,
    pageHeight: number,
    cropTop_pdf: number,
    cropBottom_pdf: number,
    scale: number,
    marginXPts: number
  ): Promise<Blob | null> {
    const page = await pdf.getPage(pageNum);
    const renderViewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;

    await page.render({
      canvasContext: canvas.getContext('2d')!,
      viewport: renderViewport,
      canvas
    }).promise;

    const cropX = marginXPts * scale;
    const cropW = renderViewport.width - cropX * 2;
    const cropY = (pageHeight - cropTop_pdf) * scale;
    const cropH = (cropTop_pdf - cropBottom_pdf) * scale;

    if (cropW <= 0 || cropH <= 0) {
      console.warn(`[CROP] Invalid crop dimensions`);
      return null;
    }

    const out = document.createElement('canvas');
    out.width = Math.round(cropW);
    out.height = Math.round(cropH);
    out.getContext('2d')!.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    // Trim whitespace before returning
    const trimmedOut = this._trimCanvasWhitespace(out);
    return new Promise(resolve => trimmedOut.toBlob(resolve, 'image/png'));
  }

  // Helper to auto-crop empty white space
  private _trimCanvasWhitespace(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return canvas;

    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    let minX = w, minY = h, maxX = 0, maxY = 0;
    let hasContent = false;

    // Scan for non-white, non-transparent pixels
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

        // If pixel is not transparent and not purely white
        if (a > 20 && (r < 250 || g < 250 || b < 250)) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          hasContent = true;
        }
      }
    }

    if (!hasContent) return canvas;

    // Add 15px of padding around the tightly cropped structure
    const padding = 15;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(w, maxX + padding);
    maxY = Math.min(h, maxY + padding);

    const trimW = maxX - minX;
    const trimH = maxY - minY;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimW;
    trimmedCanvas.height = trimH;
    const tCtx = trimmedCanvas.getContext('2d')!;

    // Fill white background
    tCtx.fillStyle = '#ffffff';
    tCtx.fillRect(0, 0, trimW, trimH);
    // Draw the tightly cropped region
    tCtx.drawImage(canvas, minX, minY, trimW, trimH, 0, 0, trimW, trimH);

    return trimmedCanvas;
  }


  async diagnosePdfCoordinates(pdfFile: File, impurityCode: string): Promise<void> {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let hasReachedImpurities = false;
    let labelFound = false;


    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();
      const items = textContent.items as any[];

      for (let i = 0; i < items.length; i++) {
        const item = items[i] as any;
        const str = (item.str ?? '').trim();
        if (!str) continue;

        const x = item.transform[4];
        const y = item.transform[5];  // PDF bottom-up baseline Y
        const w = item.width;
        const h = item.height;

        // Log everything on the page where IMPURITIES appears, and all pages after
        if (!hasReachedImpurities) {
          if (/^IMPURITIES$/i.test(str)) {
            hasReachedImpurities = true;

          }
          continue;
        }

        // Flag when we hit our label
        const labelPat = new RegExp(`^${impurityCode}\\.`);
        if (labelPat.test(str) && !labelFound) {
          labelFound = true;

        }

        // Stop after next impurity label (2 letters past ours) to keep output manageable
        if (labelFound) {
          const nextCode = String.fromCharCode(impurityCode.charCodeAt(0) + 1);
          const nextPat = new RegExp(`^${nextCode}\\.`);
          if (nextPat.test(str)) {
            break;
          }
        }
      }

      if (labelFound) break;  // remove this line if you want to see across page boundaries
    }

  }

  /**
   * Extract image data from PDF page
   */
  private async getImageFromPage(
    page: any,
    imageName: string
  ): Promise<Blob | null> {

    try {
      const operatorList = await page.getOperatorList();
      const imageIndex = operatorList.argsArray.findIndex(
        (args: any) => args[0] === imageName
      );

      if (imageIndex === -1) {
        return null;
      }

      // Render the page to canvas
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert canvas to blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/png');
      });

    } catch (error) {
      console.error('Error extracting image:', error);
      return null;
    }
  }


}