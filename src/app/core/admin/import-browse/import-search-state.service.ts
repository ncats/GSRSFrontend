import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';

/**
 * Owns the URL-query-param-driven search/filter state for ImportBrowseComponent
 * (search term, structure/sequence/bulk search, advanced-search handoff) and the
 * edit/clear actions for each filter chip. Scoped per component instance via
 * `providers: [ImportSearchStateService]`, not root, since this is per-page state.
 */
@Injectable()
export class ImportSearchStateService {
  private privateSearchTerm?: string;
  private privateStructureSearchTerm?: string;
  private privateSequenceSearchTerm?: string;
  private privateSequenceSearchKey?: string;
  private privateBulkSearchQueryId?: number;
  private privateBulkSearchStatusKey?: string;
  private privateBulkSearchSummary?: any;
  private privateSearchType?: string;
  private privateSearchStrategy?: string;
  private privateSearchCutoff?: number;
  private privateSearchSeqType?: string;
  private sequenceID?: string;
  private searchTermHash: number;
  private searchOnIdentifiers: boolean;
  private searchEntity: string;
  private searchHashFromAdvanced: string;

  isSearchEditable = false;
  smiles: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public utilsService: UtilsService,
    private configService: ConfigService,
    private gaService: GoogleAnalyticsService,
    private substanceTextSearchService: SubstanceTextSearchService
  ) { }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  get structureSearchTerm(): string {
    return this.privateStructureSearchTerm;
  }

  get sequenceSearchTerm(): string {
    return this.privateSequenceSearchTerm;
  }

  // Mirrors the original clearFilters() OR-check: a sequence search can be active via
  // the term alone, the key alone, or both, and clearSequenceSearch() should catch all three.
  get hasSequenceSearch(): boolean {
    return (this.privateSequenceSearchTerm != null && this.privateSequenceSearchTerm !== '') ||
      (this.privateSequenceSearchKey != null && this.privateSequenceSearchKey !== '');
  }

  get bulkSearchSummary(): string {
    return this.privateBulkSearchSummary;
  }
  get bulkSearchQueryId(): number {
    return this.privateBulkSearchQueryId;
  }
  get bulkSearchStatusKey(): string {
    return this.privateBulkSearchStatusKey;
  }

  get searchType(): string {
    return this.privateSearchType;
  }

  get searchStrategy(): string {
    return this.privateSearchStrategy;
  }

  get searchCutoff(): number {
    return this.privateSearchCutoff;
  }

  get searchSeqType(): string {
    return this.privateSearchSeqType;
  }

  private get isAnalyticsPrivate(): boolean {
    return this.configService.environment.isAnalyticsPrivate;
  }

  setUpPrivateSearchTerm(wildCardText?: string): void {
    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['search'] || '';
    if (wildCardText && wildCardText.length > 0) {
      if (this.privateSearchTerm.length > 0) {
        this.privateSearchTerm += ' AND "' + wildCardText + '"';
      } else {
        this.privateSearchTerm += '"' + wildCardText + '"';
      }
    }
    if (this.privateSearchTerm) {
      this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
      this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    }
  }

  setUpPrivateSearchStrategy(): void {
    // Setting privateSearchStrategy so we know what
    // search strategy is used, for example so we can
    // pass a value for use in cards.
    // I think privateSearchType is used differently.
    // I see searchType being used for 'similarity'
    this.privateSearchStrategy = null;
    if (this.privateStructureSearchTerm) {
      this.privateSearchStrategy = 'structure';
    } else if (this.privateSequenceSearchTerm) {
      this.privateSearchStrategy = 'sequence';
    } else if (this.privateBulkSearchQueryId) {
      this.privateSearchStrategy = 'bulk';
    }
  }

  initFromRoute(): void {
    this.privateStructureSearchTerm = this.activatedRoute.snapshot.queryParams['structure_search'] || '';
    this.privateSequenceSearchTerm = this.activatedRoute.snapshot.queryParams['sequence_search'] || '';
    this.privateSequenceSearchKey = this.activatedRoute.snapshot.queryParams['sequence_key'] || '';
    this.privateBulkSearchQueryId = this.activatedRoute.snapshot.queryParams['bulkQID'] || '';
    this.searchOnIdentifiers = (this.activatedRoute.snapshot.queryParams['searchOnIdentifiers'] === 'true') || false;
    this.searchEntity = this.activatedRoute.snapshot.queryParams['searchEntity'] || '';

    this.privateSearchType = this.activatedRoute.snapshot.queryParams['type'] || '';

    this.setUpPrivateSearchStrategy();

    if (this.activatedRoute.snapshot.queryParams['sequence_key'] && this.activatedRoute.snapshot.queryParams['sequence_key'].length > 9) {
      this.sequenceID = this.activatedRoute.snapshot.queryParams['source_id'];
      this.privateSequenceSearchTerm = JSON.parse(sessionStorage.getItem('gsrs_search_sequence_' + this.sequenceID));
    }
    this.privateSearchCutoff = Number(this.activatedRoute.snapshot.queryParams['cutoff']) || 0;
    this.privateSearchSeqType = this.activatedRoute.snapshot.queryParams['seq_type'] || '';
    this.smiles = this.activatedRoute.snapshot.queryParams['smiles'] || '';
    this.searchHashFromAdvanced = this.activatedRoute.snapshot.queryParams['g-search-hash'];
  }

  searchTermOkforBeginsWithSearch(): boolean {
    return (this.privateSearchTerm && !this.utilsService.looksLikeComplexSearchTerm(this.privateSearchTerm));
  }

  restricSearh(searchTerm: string): void {
    this.privateSearchTerm = searchTerm;
    this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
    this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    this.substanceTextSearchService.setSearchValue('main-substance-search', this.privateSearchTerm);
  }

  editAdvancedSearch(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'advanced search term' :
      `${this.privateSearchTerm}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-advanced-search', eventLabel);
    // ** BEGIN: Store in Local Storage for Advanced Search
    // storage searchterm in local storage when going from Browse Substance to Advanced Search (NOT COMING FROM ADVANCED SEARCH)
    if (!this.searchHashFromAdvanced) {
      const advSearchTerm: Array<String> = [];
      advSearchTerm[0] = this.privateSearchTerm;
      const queryStatementHashes = [];
      const queryStatement = {
        condition: '',
        queryableProperty: 'Manual Query Entry',
        command: 'Manual Query Entry',
        commandInputValues: advSearchTerm,
        query: this.privateSearchTerm
      };

      // Store in cookies, Category tab (Substance, Application, etc)
      const categoryHash = this.utilsService.hashCode('Substance');
      localStorage.setItem(categoryHash.toString(), 'Substance');
      queryStatementHashes.push(categoryHash);

      const queryStatementString = JSON.stringify(queryStatement);
      const hash = this.utilsService.hashCode(queryStatementString);

      // Store in cookies, Each Query Statement is stored in separate hash
      localStorage.setItem(hash.toString(), queryStatementString);

      // Push Query Statements Hashes in Array
      queryStatementHashes.push(hash);

      // Store in cookies,  store in Query Hash - Query Statement Hashes Array
      const queryStatementHashesString = JSON.stringify(queryStatementHashes);

      localStorage.setItem(this.searchTermHash.toString(), queryStatementHashesString);
    }
    // ** END: Store in Local Storage for Advanced Search

    const navigationExtras: NavigationExtras = {
      queryParams: {
        'g-search-hash': this.searchTermHash
      }
    };

    navigationExtras.queryParams['structure'] = this.privateStructureSearchTerm || null;
    navigationExtras.queryParams['type'] = this.privateSearchType || null;

    if (this.privateSearchType === 'similarity') {
      navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    }
    this.router.navigate(['/advanced-search'], navigationExtras);
  }

  editStructureSearch(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'structure search term' :
      `${this.privateStructureSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-structure-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure'] = this.privateStructureSearchTerm || null;
    navigationExtras.queryParams['type'] = this.privateSearchType || null;

    if (this.privateSearchType === 'similarity') {
      navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    }

    this.router.navigate(['/structure-search'], navigationExtras);
  }

  clearStructureSearch(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'structure search term' :
      `${this.privateStructureSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-structure-search', eventLabel);

    this.privateStructureSearchTerm = '';
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.smiles = '';
  }

  editSequenceSearh(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'sequence search term' :
      `${this.privateSequenceSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}-${this.privateSearchSeqType}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-sequence-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['type'] = this.privateSearchType || null;
    navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    navigationExtras.queryParams['seq_type'] = this.privateSearchSeqType || null;
    sessionStorage.setItem('gsrs_edit_sequence_' + this.sequenceID, JSON.stringify(this.privateSequenceSearchTerm));
    navigationExtras.queryParams['source'] = 'edit';
    navigationExtras.queryParams['source_id'] = this.sequenceID;

    this.router.navigate(['/sequence-search'], navigationExtras);
  }

  clearSequenceSearch(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'sequence search term' :
      `${this.privateSequenceSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}-${this.privateSearchSeqType}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-sequence-search', eventLabel);

    this.privateSequenceSearchTerm = '';
    this.privateSequenceSearchKey = '';
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.privateSearchSeqType = '';
  }

  editBulkSearch(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'bulk search term' :
      `${this.searchEntity}-bulk-search-${this.privateBulkSearchQueryId}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-bulk-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        bulkQID: this.privateBulkSearchQueryId,
        searchOnIdentifiers: this.searchOnIdentifiers,
        searchEntity: this.searchEntity
      }
    };
    this.router.navigate(['/bulk-search'], navigationExtras);
  }

  clearBulkSearch(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'bulk search term' :
      `${this.searchEntity}-bulk-search-${this.privateBulkSearchQueryId}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-bulk-search', eventLabel);

    this.privateBulkSearchQueryId = null;
    this.privateBulkSearchSummary = null;
    this.searchEntity = '';
    this.searchOnIdentifiers = null;
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.smiles = '';
  }

  clearSearch(): void {
    const eventLabel = this.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-search', eventLabel);

    this.privateSearchTerm = '';
    this.searchTermHash = null;
    this.substanceTextSearchService.setSearchValue('main-substance-search');
  }
}
