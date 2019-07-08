import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { SubstanceName } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';

@Component({
  selector: 'app-substance-form-names',
  templateUrl: './substance-form-names.component.html',
  styleUrls: ['./substance-form-names.component.scss']
})
export class SubstanceFormNamesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  names: Array<SubstanceName>;

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Names');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceNames.subscribe(names => {
      this.names = names;
    });
  }

  priorityUpdated(updatedName: SubstanceName): void {
    this.names.forEach(name => {
      if (name.uuid !== updatedName.uuid) {
        name.displayName = false;
      }
    });
  }

  deleteName(name: SubstanceName): void {
    this.substanceFormService.deleteSubstanceName(name);
  }

}
