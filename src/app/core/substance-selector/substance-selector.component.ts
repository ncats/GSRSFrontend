import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceSummary } from '../substance/substance.model';

@Component({
  selector: 'app-substance-selector',
  templateUrl: './substance-selector.component.html',
  styleUrls: ['./substance-selector.component.scss']
})
export class SubstanceSelectorComponent implements OnInit {
  selectedSubstance?: SubstanceSummary;
  @Input() eventCategory: string;
  @Output() selectionUpdated = new EventEmitter<SubstanceSummary>();
  @Input() placeholder = 'Search';
  @Input() hintMessage = '';
  @Input() header = 'Substance';
  @Input() name?: string;
  errorMessage: string;
  showOptions: boolean;
  displayName: string;

  constructor(
    public substanceService: SubstanceService,
  ) { }

  ngOnInit() {
  }

  @Input()
  set subuuid(uuid: string) {
    if (uuid) {
      this.substanceService.getSubstanceSummary(uuid).subscribe(response => {
        this.selectedSubstance = response;
      }, error => {
        console.log(error);
        if (this.name && this.name !== '') {
          this.selectedSubstance = {_name: this.name};
        } else {
          this.selectedSubstance = {_name: ''};
        }
        this.errorMessage = 'Not in database';
      });
    }
  }

  processSubstanceSearch(searchValue: string = ''): void {
    const q = searchValue.replace('\"', '');

    const searchStr = `root_names_name:\"^${q}$\" OR ` +
      `root_approvalID:\"^${q}$\" OR ` +
      `root_codes_BDNUM:\"^${q}$\"`;

    this.substanceService.getSubstanceSummaries(searchStr, true).subscribe(response => {
      if (response.content && response.content.length) {
        this.selectedSubstance = response.content[0];
        this.selectionUpdated.emit(this.selectedSubstance);
        this.errorMessage = '';
      } else {
        this.errorMessage = 'No substances found';
      }
    });
  }

  editSelectedSubstance(): void {
    this.selectedSubstance = null;
    this.selectionUpdated.emit(this.selectedSubstance);
  }

}
