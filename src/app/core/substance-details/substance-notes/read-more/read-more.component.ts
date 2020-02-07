import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {
  @Input() text: string;
  @Input() maxLength = 200;
  currentText: string;
  hideToggle = true;

  public isCollapsed = true;

  constructor(private elementRef: ElementRef) {
  }
  ngOnInit() {
    this.determineView();
  }
  toggleView(): void {
    this.isCollapsed = !this.isCollapsed;
    this.determineView();
  }
  determineView(): void {
    if (!this.text || this.text.length <= this.maxLength) {
      this.currentText = this.text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      this.isCollapsed = false;
      this.hideToggle = true;
      return;
    }
    this.hideToggle = false;
    if (this.isCollapsed === true) {
      this.currentText = this.text.substring(0, this.maxLength) + '...';
      this.currentText = this.currentText.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    } else if (this.isCollapsed === false)  {
      this.currentText = this.currentText = this.text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    }

  }

}
