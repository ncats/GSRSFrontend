import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceSummary } from '../substance/substance.model';
import { ConfigService } from '@gsrs-core/config';

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
  @Input() hideImage?: boolean;
  errorMessage: string;
  showOptions: boolean;
  previousSubstance: SubstanceSummary;
  displayName: string;
  private substanceSelectorProperties: Array<string> = [
    'root_names_name',
    'root_approvalID',
    'CAS',
    'ECHA\ \(EC\/EINECS\)'
  ];

  constructor(
    public substanceService: SubstanceService,
    public configService: ConfigService
  ) { }

  ngOnInit() {
    if (!this.hideImage) {
      this.hideImage = false;
    }
    if (this.configService.configData.substanceSelectorProperties != null) {
      this.substanceSelectorProperties = this.configService.configData.substanceSelectorProperties;
    }
  }

  @Input()
  set subuuid(uuid: string) {
    if (uuid) {
      this.substanceService.getSubstanceSummary(uuid).subscribe(response => {
        this.selectedSubstance = response;
      }, error => {
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

    const searchStr = this.substanceSelectorProperties.map(property => `${property}:\"^${q}$\"`).join(' OR ');

    // const searchStr = `root_names_name:\"^${q}$\" OR ` +
    //   `root_approvalID:\"^${q}$\" OR ` +
    //   `root_codes_BDNUM:\"^${q}$\"`;

    this.substanceService.getQuickSubstancesSummaries(searchStr, true).subscribe(response => {
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
    this.previousSubstance = JSON.parse(JSON.stringify(this.selectedSubstance));
    this.selectedSubstance = null;
    this.selectionUpdated.emit(this.selectedSubstance);
  }

  revertEdit(): void {
    this.selectedSubstance = JSON.parse(JSON.stringify(this.previousSubstance));
    this.selectionUpdated.emit(this.selectedSubstance);
  }

  delete(): void {
    this.selectedSubstance = null;
    this.selectionUpdated.emit(null);
  }

}
