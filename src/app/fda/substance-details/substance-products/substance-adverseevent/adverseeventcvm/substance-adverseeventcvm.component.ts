import { Component, OnInit } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverseevent/service/adverseevent.service';

@Component({
  selector: 'app-substance-adverseeventcvm',
  templateUrl: './substance-adverseeventcvm.component.html',
  styleUrls: ['./substance-adverseeventcvm.component.scss']
})

export class SubstanceAdverseEventCvmComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  public adverseevents: Array<any> = [];
  displayedColumns: string[] = [
  ];
   
 
  constructor(
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService
  ) {
    super(gaService);
  }

  ngOnInit() {
    console.log("inside Adverse substance Cvm details: ");
   
    if (this.substance) {
      console.log("SUBSTANCE");
    }
    //if (this.substance && this.substance.uuid) {
      this.getSubstanceAdverseEvent();
   // }
  }

  getSubstanceAdverseEvent(): void {
    this.adverseEventService.getSubstanceAdverseEventCvm('A').subscribe(adverseevents => {
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

