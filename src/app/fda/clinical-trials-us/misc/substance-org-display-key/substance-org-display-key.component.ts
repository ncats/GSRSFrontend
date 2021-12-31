import { Component, OnInit, AfterViewInit, Input , OnChanges} from '@angular/core';
import { GeneralService } from '../../../service/general.service';

@Component({
  selector: 'app-substance-org-display-key',
  templateUrl: './substance-org-display-key.component.html',
  styleUrls: ['./substance-org-display-key.component.scss']
})
// https://stackoverflow.com/questions/38571812/how-to-detect-when-an-input-value-changes-in-angular

export class SubstanceOrgDisplayKeyComponent implements OnInit, AfterViewInit {
  substance: any;
  orgDisplayKey: string;
  orgDisplayKeyType: string;
  private _substanceKey: string;

  constructor( public generalService: GeneralService) {}

  @Input() set substanceKey(value: string) {
    console.log('running set substanceKey:' + value);
    this._substanceKey = value;
    this.generalService.getFullSubstanceByAnyId(this._substanceKey).subscribe( response => {
      if (response != null) {
        this.substance = response;
        this.orgDisplayKeyType = this.generalService.getClinicalTrialUSSubstanceOrgDisplayKeyType();
        this.orgDisplayKey = this.generalService.getClinicalTrialUSSubstanceOrgDisplayKey(response, this.orgDisplayKeyType);
        console.log('this.orgDisplayKey: ' + this.orgDisplayKey);
      }
    });
  }

  get substanceKey(): string { return this._substanceKey; }


  ngOnInit() {}

  ngAfterViewInit() {}
/*
export class SubstanceOrgDisplayKeyComponent implements OnInit, AfterViewInit, OnChanges {
  substance: any;
  orgDisplayKey: string;
  orgDisplayKeyType: string;
  
  constructor( public generalService: GeneralService) {}

  @Input() substanceKey: string;

  ngOnChanges(changes: any) {
      this.doSomething(changes.substanceKey.currentValue);
      // You can also use categoryId.previousValue and 
      // categoryId.firstChange for comparing old and new values
  }

  doSomething(value: string) {
    console.log('running set substanceKey:' + value);
    this.substanceKey = value;
    this.generalService.getFullSubstanceByAnyId(this.substanceKey).subscribe( response => {
      if (response != null) {
        this.substance = response;
        this.orgDisplayKeyType = this.generalService.getClinicalTrialUSSubstanceOrgDisplayKeyType();
        this.orgDisplayKey = this.generalService.getClinicalTrialUSSubstanceOrgDisplayKey(response, this.orgDisplayKeyType);
        console.log('this.orgDisplayKey: ' + this.orgDisplayKey);
      }
    });

  }

  ngOnInit() {}

  ngAfterViewInit() {}
*/
}
