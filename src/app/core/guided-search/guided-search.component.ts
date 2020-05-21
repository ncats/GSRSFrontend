import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryableSubstanceDictionary } from './queryable-substance-dictionary.model';

@Component({
  selector: 'app-guided-search',
  templateUrl: './guided-search.component.html',
  styleUrls: ['./guided-search.component.scss']
})
export class GuidedSearchComponent implements OnInit {
  queryableSubstanceDictionary: QueryableSubstanceDictionary;
  displayProperties: Array<string>;
  queryStatements: Array<string> = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get('/assets/data/substance_dictionary.json').subscribe((response: QueryableSubstanceDictionary) => {
      this.queryableSubstanceDictionary = response;
      this.displayProperties = Object.keys(this.queryableSubstanceDictionary);
      this.queryStatements.push('');
    });
  }

}
