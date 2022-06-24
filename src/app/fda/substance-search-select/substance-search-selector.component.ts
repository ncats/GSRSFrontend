import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceSummary } from '@gsrs-core/substance/substance.model';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-substance-search-selector',
  templateUrl: './substance-search-selector.component.html',
  styleUrls: ['./substance-search-selector.component.scss']
})
export class SubstanceSearchSelectorComponent implements OnInit {
  selectedSubstance?: SubstanceSummary;
  @Input() eventCategory: string;
  @Output() selectionUpdated = new EventEmitter<SubstanceSummary>();
  @Output() showMessage = new EventEmitter<String>();
  @Output() searchValueOut = new EventEmitter<String>();
  @Input() placeholder = 'Search';
  @Input() hintMessage = '';
  @Input() header = 'Substance';
  @Input() name?: string;
  errorMessage: string;
  showOptions: boolean;
  displayName: string;
  searchValue: string = null;
  loadingStructure = false;
  private substanceSelectorProperties: Array<string> = null;

  constructor(
    public substanceService: SubstanceService,
    public configService: ConfigService,
  ) { }

  ngOnInit() {
    if (this.configService.configData.substanceSelectorProperties != null) {
      this.substanceSelectorProperties = this.configService.configData.substanceSelectorProperties;
    } else {
      console.log("The config value for substanceSelectorProperties is null.");
    }
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
    } else {
      this.selectedSubstance = null;
      this.searchValue = '';
    }
  }

  processSubstanceSearch(searchValue: string = ''): void {
    this.searchValue = searchValue;
    const q = searchValue.replace('\"', '');
    // Changed to configuration approach.
    const searchStr = this.substanceSelectorProperties.map(property => `${property}:\"^${q}$\"`).join(' OR ');
    /*
    const searchStr =
      `root_names_name:\"^${q}$\" OR ` +
      `root_names_stdName:\"^${q}$\" OR ` +
      `root_approvalID:\"^${q}$\" OR ` +
      `root_codes_BDNUM:\"^${q}$\"`
      ;
    */
    this.substanceService.getQuickSubstancesSummaries(searchStr, true).subscribe(response => {
      this.loadingStructure = true;
      if (response.content && response.content.length) {
        this.selectedSubstance = response.content[0];
        this.selectionUpdated.emit(this.selectedSubstance);
        this.errorMessage = '';
      } else {
        this.showMessage.emit('No substances found for ' + this.searchValue);
      }
      this.loadingStructure = false;
    });
  }

  editSelectedSubstance(): void {
    this.selectedSubstance = null;
    this.selectionUpdated.emit(this.selectedSubstance);
  }

  searchValueOutChange(searchValue: string) {
    this.searchValueOut.emit(searchValue);
  }
}
