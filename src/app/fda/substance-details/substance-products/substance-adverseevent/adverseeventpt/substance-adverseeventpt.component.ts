import { Component, OnInit } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverseevent/service/adverseevent.service';

@Component({
  selector: 'app-substance-adverseeventpt',
  templateUrl: './substance-adverseeventpt.component.html',
  styleUrls: ['./substance-adverseeventpt.component.scss']
})

export class SubstanceAdverseEventPTComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  public adverseevents: Array<any> = [];
  displayedColumns: string[] = [
    'ptTerm',
    'primSoc',
    'caseCount',
    'ptCount',
    'prr'
  ];
   
 
  constructor(
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService
  ) {
    super(gaService);
  }

  ngOnInit() {
    console.log("inside Adverse substance details: ");
   
    if (this.substance) {
      console.log("SUBSTANCE");
    }
    //if (this.substance && this.substance.uuid) {
      this.getSubstanceAdverseEvent();
   // }
  }

  getSubstanceAdverseEvent(): void {
    this.adverseEventService.getSubstanceAdverseEvent('AAAAAAA').subscribe(adverseevents => {
      console.log("AE PT LENGTH: " + adverseevents.length);
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
