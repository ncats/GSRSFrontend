import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-adverse-events-browse',
  templateUrl: './adverse-events-browse.component.html',
  styleUrls: ['./adverse-events-browse.component.scss']
})
export class AdverseEventsBrowseComponent implements OnInit {

  tabSelectedIndex = 0;
  category = 'Adverse Event PT';
  constructor() { }

  ngOnInit() {
  }

  tabSelectedUpdated(event: MatTabChangeEvent) {
    if (event) {
      this.category = event.tab.textLabel;
      if (this.category) {
        const screenWidth = window.innerWidth;

        const screenHeight = window.innerHeight;
     //   alert(screenHeight + '    ' + screenWidth);
     //   window.resizeTo((screenWidth + 1), screenHeight);

    //    this.tabClicked = true;
    //    this.loadFileName();
      }
    }
  }

}
