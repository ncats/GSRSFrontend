import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { SubstanceNameOrg } from '../../../substance/substance.model';
import { MatTableDataSource } from '@angular/material/table';
import { ControlledVocabularyService } from '../../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../controlled-vocabulary/vocabulary.model';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-name-orgs',
  templateUrl: './name-orgs.component.html',
  styleUrls: ['./name-orgs.component.scss']
})
export class NameOrgsComponent implements OnInit {
  private privateNameOrgs: Array<SubstanceNameOrg>;
  nameOrgOptions: Array<VocabularyTerm> = [];
  displayedColumns: string[] = ['delete', 'nameOrg', 'deprecated'];
  tableData: MatTableDataSource<SubstanceNameOrg>;
  isExpanded = false;

  constructor(
    private cvService: ControlledVocabularyService,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('NAME_ORG').subscribe(response => {
      this.nameOrgOptions = response['NAME_ORG'].list;
    });
  }

  @Input()
  set nameOrgs(nameOrgs: Array<SubstanceNameOrg>) {
    this.privateNameOrgs = nameOrgs;
    this.tableData = new MatTableDataSource<SubstanceNameOrg>(this.privateNameOrgs);
  }

  get nameOrgs(): Array<SubstanceNameOrg> {
    return this.privateNameOrgs || [];
  }

  panelOpened(): void {
    this.isExpanded = true;
    const event: Event = new Event('focusin', { bubbles: true, cancelable: true} );
    this.element.nativeElement.dispatchEvent(event);
  }

  panelClosed(): void {
    this.isExpanded = false;
    const event: Event = new Event('focusout', { bubbles: true, cancelable: true} );
    this.element.nativeElement.dispatchEvent(event);
  }

  updateNameOrg(event: MatSelectChange, nameOrg: SubstanceNameOrg): void {
    nameOrg.nameOrg = event.value;
  }

  updateDeprecated(event: MatCheckboxChange, nameOrg: SubstanceNameOrg): void {
    nameOrg.deprecated = event.checked;
  }

  addNewNameOrg(event: Event): void {
    event.stopPropagation();
    this.privateNameOrgs.unshift({
      nameOrg: this.nameOrgOptions[0].value
    });
    this.tableData.data = this.privateNameOrgs;
  }

  deleteNameOrg(nameOrg: SubstanceNameOrg): void {
    const nameOrgIndex = this.privateNameOrgs.findIndex(privateNameOrg => privateNameOrg === nameOrg);
    if (nameOrgIndex > -1) {
      this.privateNameOrgs.splice(nameOrgIndex, 1);
      this.tableData.data = this.privateNameOrgs;
    }
  }

}
