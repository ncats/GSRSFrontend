import { Component, OnInit, Input } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverseevent/service/adverseevent.service';

@Component({
  selector: 'app-substance-adverseeventdme',
  templateUrl: './substance-adverseeventdme.component.html',
  styleUrls: ['./substance-adverseeventdme.component.scss']
})

export class SubstanceAdverseEventDmeComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  public adverseevents: Array<any> = [];
  displayedColumns: string[] = [
    'dmeReactions','ptTermMeddra','caseCount', 'dmeCount','dmeCountPercent','weightedAvgPrr'
  ];
   
  @Input() bdnum: string;

  constructor(
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService
  ) {
    super(gaService);
  }

  ngOnInit() {
    console.log("inside Adverse DME substance details: ");
   
    if (this.substance) {
      console.log("SUBSTANCE");
    }
    //if (this.substance && this.substance.uuid) {
      this.getSubstanceAdverseEvent();
   // }
  }

  getSubstanceAdverseEvent(): void {
    this.adverseEventService.  getSubstanceAdverseEventDme(this.bdnum).subscribe(adverseevents => {
      console.log("AE DME LENGTH: " + adverseevents.length);
      this.adverseevents = adverseevents;
      this.filtered = adverseevents;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.adverseevents, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.countUpdate.emit(adverseevents.length);
    });
  }
    
}
