import { Component, OnInit } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { SubstanceCode } from '../../substance/substance.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-substance-codes',
  templateUrl: './substance-codes.component.html',
  styleUrls: ['./substance-codes.component.scss']
})
export class SubstanceCodesComponent extends SubstanceCardBaseFilteredList<SubstanceCode> implements OnInit {
  type: string;
  codes: Array<SubstanceCode> = [];
  displayedColumns: string[];

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.type != null) {

      if (this.type === 'classification') {
        this.displayedColumns = ['classificationTree', 'codeSystem', 'code'];
      } else {
        this.displayedColumns = ['codeSystem', 'code', 'type', 'description'];
      }

      this.filterSubstanceCodes();

      if (this.codes != null && this.codes.length) {
        this.filtered = this.codes;
        this.pageChange();

        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.codes);
        }, error => {
          console.log(error);
        });
      }
    }
  }

  private filterSubstanceCodes(): void {
    if (this.substance.codes && this.substance.codes.length > 0) {
      this.substance.codes.forEach(code => {
        if (code.comments && code.comments.indexOf('|') > -1 && this.type === 'classification') {
          this.codes.push(code);
        } else if (code.comments && code.comments.indexOf('|') === -1 && this.type === 'identifiers') {
          this.codes.push(code);
        }
      });
    }
  }

  getClassificationTree(comments: string): Array<string> {
    return comments.split('|');
  }

  getIndentation(treeLevelIndex: number): any {
    const pxPadding = treeLevelIndex * 10; 
    const style = `padding-left:${ pxPadding }px`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
