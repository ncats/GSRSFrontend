import {Component, Input, OnInit} from '@angular/core';
import {Alignment} from '@gsrs-core/utils';

@Component({
    selector: 'app-sequence-alignment',
    templateUrl: './sequence-alignment.component.html',
    styleUrls: ['./sequence-alignment.component.scss'],
    standalone: false
})
export class SequenceAlignmentComponent implements OnInit {
  @Input() alignmentArray: Alignment;
  alignment: Alignment;
  text: string;
  targetSitesText: string;
  alignmentBodyText: string;
  constructor() { }

  ngOnInit() {
    if (this.alignmentArray && this.alignmentArray.alignments && this.alignmentArray.alignments.length) {
      this.alignment = this.alignmentArray.alignments[0];
      this.text = '';
      if (this.alignment.global) {
        this.text += 'identity: = ' + this.alignment.global.toFixed(3).toString() + ' \n';
      }
      if (this.alignment.iden) {
        this.text += 'local:    = ' + this.alignment.iden.toFixed(3).toString() + ' \n';
      }
      if (this.alignment['sub']) {
        this.text += 'sub:      = ' + this.alignment['sub'].toFixed(3).toString() + ' \n';
      }
      if (this.alignment.score) {
        this.text += 'matched:  = ' + this.alignment.score.toString() + ' \n';
      }
      if (this.alignment.score) {
        const alignStr = this.alignment.alignment || '';
        const targetMatch = alignStr.match(/^(Target Sites:[^\n]*\n?)([\s\S]*)$/m);
        if (targetMatch) {
          this.targetSitesText = targetMatch[1];
          this.alignmentBodyText = targetMatch[2];
        } else {
          this.alignmentBodyText = alignStr;
        }
      }
    }
  }

}
