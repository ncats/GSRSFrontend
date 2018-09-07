import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail } from '../substance/substance.model';

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
    private substanceService: SubstanceService
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
    this.substanceService.searchSubstances(this.searchTerm, true).subscribe(pagingResponse => {
      this.substances = pagingResponse.content;
    }, error => {
      console.log(error);
    });
  }

}
