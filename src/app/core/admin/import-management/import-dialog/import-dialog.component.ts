import { Component, OnInit, Inject } from '@angular/core';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {
  settingsActive: any;
  setType: string;
  fieldList: Array <any>;
 formControl = new FormControl();
  codeActions: any = {
    "codeSystem": "",
        "code": "",
        "codeType": ""};
  propertyActions: any = {
     "name": "",
      "propertyType": "",
      "valueRange": "",
      "valueUnits": ""
    };
    nameActions: any = {
      "name": "",
        "nameType": "",
        "lang": "",
        "referenceUUIDs": []
    }; 
    noteActions: any = {
      "note":""
    }; 
    settingTypes = ["Create Name Action", "Create Code Action", "Create Property Action", "Create Note Action"];
  constructor(
    public cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.settingsActive = data.settingsActive;
    this.setType = data.settingsActive.label;
    this.fieldList = data.fieldList;
 
  }

  ngOnInit(): void {
  }

  switchAction(action?: any) {
  //  if (action.value !=  this.setType) {
      if (action.value == "Create Name Action") {
        this.settingsActive.actionParameters = this.nameActions;
        this.settingsActive.actionName = 'common_name';
      } else if (action.value == "Create Code Action") {
        this.settingsActive.actionParameters = this.codeActions;
        this.settingsActive.actionName = 'code_import';
      } else if (action.value == "Create Property Action") {
        this.settingsActive.actionParameters = this.propertyActions;
        this.settingsActive.actionName = 'property_import';
      }else if (action.value == "Create Note Action") {
        this.settingsActive.actionParameters = this.noteActions;
        this.settingsActive.actionName = 'note_import';
      }
      this.settingsActive.label = action.value;
  //  }
  //  console.log(this.settingsActive);

  }
  updateType(event: any, field: string) {
    this.settingsActive.actionParameters[field] = event;
  }

  close(send?: string) {
    if (send) {
      this.dialogRef.close(this.settingsActive);
    } else {
      this.dialogRef.close();
    }
  }

}
