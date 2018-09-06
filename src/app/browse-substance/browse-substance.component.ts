import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceSummary } from '../substance/substance.model';

@Component({
  selector: 'app-browse-substance',
  templateUrl: './browse-substance.component.html',
  styleUrls: ['./browse-substance.component.scss']
})
export class BrowseSubstanceComponent implements OnInit {
  private searchTerm: string;
  public substances: Array<SubstanceSummary>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService
  ) {}

  ngOnInit() {
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        this.searchTerm = params.get('search_term') || '';
        this.getSubstances();
      });
  }

  getSubstances() {
    this.substanceService.getSubtances().subscribe(pagingResponse => {
      this.substances = pagingResponse.content;
      console.log(this.substances);
    }, error => {
      console.log(error);
    });
  }

}
