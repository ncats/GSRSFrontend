import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail, SubstanceCode } from '../substance/substance.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { ReturnStatement } from '../../../node_modules/@angular/compiler';

@Component({
  selector: 'app-browse-substance',
  templateUrl: './browse-substance.component.html',
  styleUrls: ['./browse-substance.component.scss']
})
export class BrowseSubstanceComponent implements OnInit {
  private searchTerm: string;
  public substances: Array<SubstanceDetail>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private sanitizer: DomSanitizer,
    public configService: ConfigService
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
    this.substanceService.getSubtanceDetails(this.searchTerm).subscribe(pagingResponse => {
      this.substances = pagingResponse.content;
      console.log(this.substances);
      _.forEach(this.substances, substance => {
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
          console.log(substance.codeSystems, substance.codeSystemNames);
        }
      });
    }, error => {
      console.log(error);
    });
  }

  getSafeStructureImgUrl(structureId: string): SafeUrl {

    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=150`;

    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  getCodesByCodeSystem(codes: Array<SubstanceCode>): { codes: Array<string>, codeSystems: { [codeSystem: string]: Array<SubstanceCode> } } {
    const returnObject: { codes: Array<string>, codeSystems: { [codeSystem: string]: Array<SubstanceCode> } } = {
      codes: [],
      codeSystems: {}
    };

   

    console.log(returnObject);
    return returnObject;
  }

}
