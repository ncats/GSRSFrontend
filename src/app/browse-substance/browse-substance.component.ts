import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail } from '../substance/substance.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';

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
    }, error => {
      console.log(error);
    });
  }

  getSafeStructureImgUrl(structureId: string): SafeUrl {

    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=150`;

    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

}
