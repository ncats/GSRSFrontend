import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
  OnDestroy,
  ViewChild,
  ElementRef, AfterViewInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryableSubstanceDictionary } from '@gsrs-core/guided-search/queryable-substance-dictionary.model';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '@gsrs-core/config';
// import { QueryStatement } from './query-statement/query-statement.model';
// import { typeCommandOptions } from './query-statement/type-command-options.constant';
import { UtilsService } from '@gsrs-core/utils';
import { environment } from '../../../environments/environment';
import { EditorImplementation } from '@gsrs-core/structure-editor/structure-editor-implementation.model';
import { Ketcher } from 'ketcher-wrapper';
import { JSDraw } from 'jsdraw-wrapper';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Editor } from '@gsrs-core/structure-editor/structure.editor.model';
import { AdvancedQueryStatement } from './advanced-query-statement/advanced-query-statement.model';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material';
import { InterpretStructureResponse } from '@gsrs-core/structure/structure-post-response.model';
import { StructureExportComponent } from '@gsrs-core/structure/structure-export/structure-export.component';
import { StructureImportComponent } from '@gsrs-core/structure/structure-import/structure-import.component';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

  query: string;
  queryStatements: Array<AdvancedQueryStatement> = [];
  queryableSubstanceDict: QueryableSubstanceDictionary;
  displayProperties: Array<string>;
  displayPropertiesCommon: Array<string>;
  searchTypeControl = new FormControl();
  private editor: Editor;
  private searchType: string;
  similarityCutoff?: number;
  showSimilarityCutoff = false;
  // editor: EditorImplementation;
  // @Output() editorOnLoad = new EventEmitter<EditorImplementation>();
  // @Output() loadedMolfile = new EventEmitter<string>();
  private ketcher: Ketcher;
  private jsdraw: JSDraw;
  structureEditor: string;
  anchorElement: HTMLAnchorElement;
  smiles: string;
  mol: string;
  height = 0;
  width = 0;
  canvasToggle = true;
  canvasMessage = '';
  tempClass = "";
  @ViewChild('structure_canvas', { static: false }) myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public canvasCopy: HTMLCanvasElement;
  private jsdrawScriptUrls = [
    `${environment.baseHref || '/'}assets/dojo/dojo.js`,
    `${environment.baseHref || '/'}assets/jsdraw/Scilligence.JSDraw2.Pro.js`,
    `${environment.baseHref || '/'}assets/jsdraw/Scilligence.JSDraw2.Resources.js`,
    `${environment.baseHref || '/'}assets/jsdraw/JSDraw.extensions.js`

  ];
  ketcherFilePath: string;
  category = 'Substance';
  @ViewChild('contentContainer', { static: true }) contentContainer;
  private overlayContainer: HTMLElement;
  dictionaryFileName: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService,
    private utilitiesService: UtilsService,
    private gaService: GoogleAnalyticsService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    //  private renderer: Renderer2,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,

  ) { }

  ngOnInit() {
    this.titleService.setTitle(`Advanced Search`);
    const guidedSearchHash = Number(this.activatedRoute.snapshot.queryParams['g-search-hash']) || null;
    let queryStatementHashes: Array<number>;
    if (guidedSearchHash) {
      const queryStatementHashesString = localStorage.getItem(guidedSearchHash.toString());
      if (queryStatementHashesString != null) {
        queryStatementHashes = JSON.parse(queryStatementHashesString);
      }
    }

    this.loadFileName();

    //  this.getSearchField();

    /*
      if (queryStatementHashes != null) {
        queryStatementHashes.forEach(queryStatementHash => {
          this.queryStatements.push({queryHash: queryStatementHash});
        });
      } else {
        this.queryStatements.push({});
      }
    */

    /*
    this.http.get(`${this.configService.environment.baseHref}assets/data/substance_dictionary.json`)
      .subscribe((response: QueryableSubstanceDictionary) => {

        response['All'] = {
          lucenePath: 'text',
          description: 'All substance fields',
          type: 'string',
          cvDomain: ''
        };
        this.queryableSubstanceDict = response;

        const displayProperties = ['All'];
        const displayPropertiesCommon = ['All'];
        Object.keys(this.queryableSubstanceDict).forEach(key => {
          displayProperties.push(key);
          if (this.queryableSubstanceDict[key].priority != null) {
            displayPropertiesCommon.push(key);
          }
        });
        this.displayProperties = displayProperties;
        this.displayPropertiesCommon = displayPropertiesCommon;

        console.log('AAAA: ' + JSON.stringify(this.displayPropertiesCommon));
        if (queryStatementHashes != null) {
          queryStatementHashes.forEach(queryStatementHash => {
            this.queryStatements.push({queryHash: queryStatementHash});
          });
        } else {
      //    this.queryStatements.push({});
        }
    });
    */

  }

  tabSelected($event) {
    if ($event) {
      const evt: any = $event.tab;
      this.category = evt.textLabel;
      if (this.category) {
        this.loadFileName();

        /*       this.loadingStatus = 'Loading data...';
               this.provenance = textLabel;
               //  const index = textLabel.indexOf(' ');
               //  const tab = textLabel.slice(0, index);
               // this.country = textLabel.slice(index + 1, textLabel.length);
               // set the current result data to empty or null.
               this.paged = [];
       
               this.getSubstanceProducts();
       
             }
       */
      }
    }
  }


  editorOnLoad(editor: Editor): void {
    /*
    this.loadingService.setLoading(false);
    this.editor = editor;
    setTimeout(() => {
      this.activatedRoute
        .queryParamMap
        .subscribe(params => {
          if (params.has('structure')) {
            this.structureService.getMolfile(params.get('structure')).subscribe(molfile => {
              this.editor.setMolecule(molfile);
            });
          }
          if (params.has('type')) {
            this.searchType = params.get('type');
          }

          if (this.searchType === 'similarity') {
            this.showSimilarityCutoff = true;
            this.similarityCutoff = params.has('cutoff') && Number(params.get('cutoff')) || 0.8;
          }

          this.searchTypeControl.setValue(this.searchType);
        });
    });
    */
  }

  /*
  queryUpdated(advancedQueryStatement: AdvancedQueryStatement, index: number) {
    setTimeout(() => {
      Object.keys(advancedQueryStatement).forEach(key => {
        this.queryStatements[index][key] = advancedQueryStatement[key];
      });
      this.query = '';
      this.query = this.queryStatements.map(statement => statement.query).join(' ').trim();
    });
  }
*/

  searchTypeSelected(event): void {
    this.searchType = event.value;

    this.gaService.sendEvent('structureSearch', 'select:search-type', this.searchType);

    if (this.searchType === 'similarity') {
      this.showSimilarityCutoff = true;
      this.similarityCutoff = 0.8;
    } else {
      this.showSimilarityCutoff = false;
    }
  }

  molvecUpdate(mol: any) {
    this.editor.setMolecule(mol);
  }

  openStructureImportDialog(): void {
    this.gaService.sendEvent('structureSearch', 'button:import', 'import structure');
    const dialogRef = this.dialog.open(StructureImportComponent, {
      height: 'auto',
      width: '650px',
      data: {}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe((structurePostResponse?: InterpretStructureResponse) => {
      this.overlayContainer.style.zIndex = null;

      if (structurePostResponse && structurePostResponse.structure && structurePostResponse.structure.molfile) {
        this.editor.setMolecule(structurePostResponse.structure.molfile);
      }
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  openStructureExportDialog(): void {
    this.gaService.sendEvent('structureSearch', 'button:export', 'export structure');
    const dialogRef = this.dialog.open(StructureExportComponent, {
      height: 'auto',
      width: '650px',
      data: {
        molfile: this.editor.getMolfile(),
        smiles: this.editor.getSmiles()
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  searchCutoffChanged(event): void {
    this.similarityCutoff = event.value;
    this.gaService.sendEvent('structureSearch', 'slider', 'similarity-cutoff', this.similarityCutoff);
  }

  get _editor(): Editor {
    return this.editor;
  }

  get _searchType(): string {
    return this.searchType;
  }

  nameResolved(molfile: string): void {
    this.editor.setMolecule(molfile);
  }

  getSearchField() {

    /*
    const url = `${this.configService.environment.baseHref}assets/data/` + this.dictionaryFileName;
    // alert(url);
    this.http.get(`${this.configService.environment.baseHref}assets/data/` + this.dictionaryFileName)
      .subscribe((response: QueryableSubstanceDictionary) => {

        response['All'] = {
          lucenePath: 'text',
          description: 'All fields',
          type: 'string',
          cvDomain: ''
        };
        this.queryableSubstanceDict = response;
        // console.log(JSON.stringify('AAAA ' + this.queryableSubstanceDict));

        const displayProperties = ['All'];
        const displayPropertiesCommon = ['All'];
        Object.keys(this.queryableSubstanceDict).forEach(key => {
          displayProperties.push(key);
          if (this.queryableSubstanceDict[key].priority != null) {
            displayPropertiesCommon.push(key);
          }
        });
        this.displayProperties = displayProperties;
        this.searchFields = displayPropertiesCommon;

        if (queryStatementHashes != null) {
          queryStatementHashes.forEach(queryStatementHash => {
            this.queryStatements.push({ queryHash: queryStatementHash });
          });
        } else {
          this.queryStatements.push({});
        }
        
        this.queryStatements.push({});
      });

    // this.searchFields = this.displayPropertiesCommon;

    //  console.log(JSON.stringify(this.displayPropertiesCommon));
    */


    this.http.get(`${this.configService.environment.baseHref}assets/data/` + this.dictionaryFileName)
      //   this.http.get(`${this.configService.environment.baseHref}assets/data/substance_dictionary.json`)
      .subscribe((response: QueryableSubstanceDictionary) => {

        response['All'] = {
          lucenePath: 'text',
          description: 'All substance fields',
          type: 'string',
          cvDomain: ''
        };
        this.queryableSubstanceDict = response;

        const displayProperties = ['All'];
        const displayPropertiesCommon = ['All'];
        Object.keys(this.queryableSubstanceDict).forEach(key => {
          displayProperties.push(key);
          if (this.queryableSubstanceDict[key].priority != null) {
            displayPropertiesCommon.push(key);
          }
        });
        this.displayProperties = displayProperties;
        this.displayPropertiesCommon = displayPropertiesCommon;

        //   console.log('AAAA: ' + JSON.stringify(this.queryableSubstanceDict));
        //    console.log('BBBBB: ' + JSON.stringify(this.displayProperties));
        //     console.log('CCCC: ' + JSON.stringify(this.displayPropertiesCommon));
        /*   if (queryStatementHashes != null) {
             queryStatementHashes.forEach(queryStatementHash => {
               this.queryStatements.push({queryHash: queryStatementHash});
             });
           } else {
         */
        //   alert(this.queryStatements.length);
        if (this.queryStatements.length == 0) {
          this.queryStatements.push({});
        }
        //  }
      });

  }

  private loadFileName() {
    if (this.category) {
      // Empty current SearchField Array
      // this.searchFields.splice(0, this.searchFields.length);
      //Clear current query
      this.query = '';
      if (this.category === 'Substance') {
        this.dictionaryFileName = 'substance_dictionary.json';
      }
      else if (this.category === 'Application') {
        this.dictionaryFileName = 'application_dictionary.json';
      }
      else if (this.category === 'Product') {
        this.dictionaryFileName = 'product_dictionary.json';
      }
      else if (this.category === 'Clinical Trial') {
        this.dictionaryFileName = 'clinicaltrial_dictionary.json';
      }
    }
    this.getSearchField();
  }

  tabSelectUpdated(category: string) {
    this.category = category;
  }

  queryUpdated(queryStatement: AdvancedQueryStatement, index: number) {
    setTimeout(() => {
      Object.keys(queryStatement).forEach(key => {
        this.queryStatements[index][key] = queryStatement[key];
      });
      this.query = '';
      this.query = this.queryStatements.map(statement => statement.query).join(' ').trim();
    });
  }

  addQueryStatement(): void {
    this.queryStatements.push({
      condition: '',
      queryableProperty: 'All',
      command: ''
    });
  }

  removeQueryStatement(index: number): void {
    this.queryStatements.splice(index, 1);
    this.query = this.queryStatements.map(statement => statement.query).join(' ');
  }

  processSearch(): void {

    const queryStatementHashes = [];

    this.queryStatements.forEach(queryStatement => {
      const queryStatementString = JSON.stringify(queryStatement);
      const hash = this.utilitiesService.hashCode(queryStatementString);
      localStorage.setItem(hash.toString(), queryStatementString);
      queryStatementHashes.push(hash);
    });

    const queryHash = this.utilitiesService.hashCode(this.query);
    const queryStatementHashesString = JSON.stringify(queryStatementHashes);

    localStorage.setItem(queryHash.toString(), queryStatementHashesString);

    const navigationExtras: NavigationExtras = {
      queryParams: this.query ? { 'search': this.query } : null
    };

    const navigationExtrasClinical: NavigationExtras = {
      queryParams: this.query ? { 'searchTerm': this.query } : null
    };

    const navigationExtras2: NavigationExtras = {
      queryParams: {
        'g-search-hash': queryHash.toString()
      }
    };

    // this is a test of the push state needed
    // to keep the back button working as desired
    window.history.pushState({}, 'Advanced Search', '/advanced-search'
      + '?g-search-hash=' + navigationExtras2.queryParams['g-search-hash']);


    // If Substance Tab selected, go to Browse Substance Page.
    // If Application Tab selected, go to Browse Application page. 

    if (this.category) {
      if (this.category === 'Substance') {
        this.router.navigate(['/browse-substance'], navigationExtras);
      }
      else if (this.category === 'Application') {
        this.router.navigate(['/browse-applications'], navigationExtras);
      }
      else if (this.category === 'Product') {
        this.router.navigate(['/browse-products'], navigationExtras);
      }
      else if (this.category === 'Clinical Trial') {
        this.router.navigate(['/browse-clinical-trials'], navigationExtrasClinical);
      }
    }
    else {
      this.router.navigate(['/browse-substance'], navigationExtras);
    }
  }

}
