import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance.service';
import { SubstanceDetail } from '../substance.model';

@Component({
  selector: 'app-substance-details',
  templateUrl: './substance-details.component.html',
  styleUrls: ['./substance-details.component.scss']
})
export class SubstanceDetailsComponent implements OnInit {
  id: string;
  substance: SubstanceDetail;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService
  ) { }

  // use aspirin for initial development a05ec20c-8fe2-4e02-ba7f-df69e5e30248
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    console.log(this.id);
    this.getSubstanceDetails();
  }

  getSubstanceDetails() {
    this.substanceService.getSubstanceDetails(this.id).subscribe(response => {
      console.log(response);
      this.substance = response;
    });
  }
}
