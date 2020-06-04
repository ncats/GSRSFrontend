import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryableSubstanceDictionary } from './queryable-substance-dictionary.model';
import { NavigationExtras, Router } from '@angular/router';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-guided-search',
  templateUrl: './guided-search.component.html',
  styleUrls: ['./guided-search.component.scss']
})
export class GuidedSearchComponent implements OnInit {
  queryableSubstanceDictionary: QueryableSubstanceDictionary;
  displayProperties: Array<string>;
  queryStatements: Array<{value?: string}> = [];
  query = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.http.get(`${this.configService.environment.baseHref}assets/data/substance_dictionary.json`)
      .subscribe((response: QueryableSubstanceDictionary) => {
      this.queryableSubstanceDictionary = response;
      this.displayProperties = Object.keys(this.queryableSubstanceDictionary);
      this.queryableSubstanceDictionary['All'] = {
        lucenePath: '',
        description: 'All substance fields',
        type: 'string',
        cvDomain: ''
      };
      this.displayProperties.unshift('All');
      this.queryStatements.push({});
    });
  }

  queryUpdated(queryStatement: string, index: number): void {
    this.queryStatements[index].value = queryStatement;
    this.query = this.queryStatements.map(statement => statement.value).join(' ');
  }

  addQueryStatement(): void {
    this.queryStatements.push({});
  }

  removeQueryStatement(index: number): void {
    this.queryStatements.splice(index, 1);
    this.query = this.queryStatements.map(statement => statement.value).join(' ');
  }

  processSearch(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: this.query ? { 'search': this.query } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }
}
