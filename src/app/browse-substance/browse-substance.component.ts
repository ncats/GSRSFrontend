import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail, SubstanceCode } from '../substance/substance.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { Facet } from '../utils/facet.model';
import { LoadingService } from '../loading/loading.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-browse-substance',
  templateUrl: './browse-substance.component.html',
  styleUrls: ['./browse-substance.component.scss']
})
export class BrowseSubstanceComponent implements OnInit {
  private searchTerm: string;
  public substances: Array<SubstanceDetail>;
  public facets: Array<Facet>;
  private facetParams: { [facetName: string]: { [facetValueLabel: string]: boolean } } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        this.searchTerm = params.get('search_term') || '';
        this.searchSubstances();
      });
  }

  searchSubstances() {
    this.loadingService.setLoading(true);
    this.substanceService.getSubtanceDetails(this.searchTerm, true, this.facetParams).subscribe(pagingResponse => {
      this.substances = pagingResponse.content;
      if (pagingResponse.facets && pagingResponse.facets.length > 0){
        let sortedFacets = _.orderBy(pagingResponse.facets, facet => {
          let valuesTotal = 0;
          _.forEach(facet.values, value => {
            valuesTotal += value.count;
          });
          return valuesTotal;
        }, 'desc');
        this.facets = _.take(sortedFacets, 10);
        sortedFacets = null;
      }
      console.log(this.facets);
      _.forEach(this.substances, (substance: SubstanceDetail) => {
        if (substance.codes && substance.codes.length > 0) {
          substance.codeSystemNames = [];
          substance.codeSystems = {};
          _.forEach(substance.codes, code => {
            if (substance.codeSystems[code.codeSystem]) {
              substance.codeSystems[code.codeSystem].push(code);
            } else {
              substance.codeSystems[code.codeSystem] = [code];
              substance.codeSystemNames.push(code.codeSystem);
            }
          });
        }
      });
      this.loadingService.setLoading(false);
    }, error => {
      console.log(error);
      this.loadingService.setLoading(false);
    });
  }

  getSafeStructureImgUrl(structureId: string): SafeUrl {

    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=150`;

    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  updateFacetSelection(event: MatCheckboxChange, facetName: string, facetValueLabel: string): void {
    
    if (this.facetParams[facetName] == null) {
      this.facetParams[facetName] = {};
    }

    this.facetParams[facetName][facetValueLabel] = event.checked;

    let facetHasSelectedValue = false;
    
    const facetValueKeys = Object.keys(this.facetParams[facetName])
    for (let i = 0; i < facetValueKeys.length; i++) {
      if (this.facetParams[facetName][facetValueKeys[i]]) {
        facetHasSelectedValue = true;
        break;
      }
    }
    
    if (!facetHasSelectedValue) {
      this.facetParams[facetName] = undefined;
    }

    this.searchSubstances();

  }

}
