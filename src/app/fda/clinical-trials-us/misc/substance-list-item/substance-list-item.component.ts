import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ClinicalTrialUSService } from '../../service/clinical-trial-us.service';
import { GeneralService } from '../../../service/general.service';
import { ClinicalTrialUSDrug } from '../../model/clinical-trial-us.model';

@Component({
  selector: 'app-substance-list-item',
  templateUrl: './substance-list-item.component.html',
  // why doesn't this resolve?
  styleUrls: ['./substance-list-item.component.scss']
})
export class SubstanceListItemComponent implements OnInit, AfterViewInit {

  @Input() clinicalTrialUSDrug: ClinicalTrialUSDrug;

  substance: any;

  constructor(
    public clinicalTrialUSService: ClinicalTrialUSService,
    public generalService: GeneralService
  ) {
  }

  ngOnInit() {
    this.generalService.getSubstanceByAnyId(this.clinicalTrialUSDrug.substanceKey).subscribe( response => {
      if (response != null) {
        this.substance = response;
      }
    });
  }

  ngAfterViewInit() {

  }

}
