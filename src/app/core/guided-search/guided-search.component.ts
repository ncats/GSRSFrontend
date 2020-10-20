import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryableSubstanceDictionary } from './queryable-substance-dictionary.model';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '@gsrs-core/config';
import { QueryStatement } from './query-statement/query-statement.model';
import { typeCommandOptions } from './query-statement/type-command-options.constant';
import { UtilsService } from '@gsrs-core/utils';

@Component({
  selector: 'app-guided-search',
  templateUrl: './guided-search.component.html',
  styleUrls: ['./guided-search.component.scss']
})
export class GuidedSearchComponent implements OnInit {
  queryableSubstanceDict: QueryableSubstanceDictionary;
  displayProperties: Array<string>;
  displayPropertiesCommon: Array<string>;
  queryStatements: Array<QueryStatement> = [];
  query = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService,
    private utilitiesService: UtilsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const guidedSearchHash = Number(this.activatedRoute.snapshot.queryParams['g-search-hash']) || null;
    let queryStatementHashes: Array<number>;
    if (guidedSearchHash) {
      const queryStatementHashesString = localStorage.getItem(guidedSearchHash.toString());
      if (queryStatementHashesString != null) {
        queryStatementHashes = JSON.parse(queryStatementHashesString);
      }
    }

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

        if (queryStatementHashes != null) {
          queryStatementHashes.forEach(queryStatementHash => {
            this.queryStatements.push({queryHash: queryStatementHash});
          });
        } else {
          this.queryStatements.push({});
        }
    });
  }

  queryUpdated(queryStatement: QueryStatement, index: number) {
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

    this.router.navigate(['/browse-substance'], navigationExtras);
  }
}
