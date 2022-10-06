import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubstanceService } from '@gsrs-core/substance/substance.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {
  name: string;
  extension: string;
  showOptions = false;
  scrubberModel = {};
  expanderModel = {};
  expanderSchema: any;
  options = [];
  loadedConfig: any;
  configName: string;
  message: string;
  privateModel: any;
  private privateOptions: any;
  temp: any;
  

 mySchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gsrs.ncats.nih.gov/#/export.scrubber.schema.json",
  "title": "Scrubber Parameters",
  "description": "Factors that control the behavior of a Java class that removes private parts of a data object before the object is shared",
  "type": "object",
  "properties": {
    "removeDates": {
      "comments": "When true, remove all date fields from output",
      "type": "boolean",
      "title": "Remove Date"
    },
    "deidentifyAuditUser": {
      "comments": "When true, remove users listed as creator or modifier of records and subrecords",
      "type": "boolean",
      "title": "Deidentify Audit User"
    },
    "accessGroupsToInclude": {
      "comments": "names of access groups to that will NOT be removed ",
      "type": "array",
      "items": {
        "type": "string"
      },
      "title": "Access Groups to Include",
      "visibleIf": {
        "removeAllLocked": [
          true
        ]
      },
      "widget": {
        "id": "multi-select"
      },
      "CVDomain": "ACCESS_GROUP"
    },
    "accessGroupsToRemove": {
      "comments": "names of access groups to that WILL be removed ",
      "type": "array",
      "items": {
        "type": "string"
      },
      "title": "Access Groups to Remove",
      "visibleIf": {
        "removeAllLocked": [
          true
        ]
      },
      "widget": {
        "id": "multi-select"
      },
      "CVDomain": "ACCESS_GROUP"
    },
    "removeElementsIfNoExportablePublicRef": {
      "comments": "elements to remove when they have no public references",
      "type": "boolean",
      "title": "Remove Elements if no exportable selected public domain reference",
      "visibleIf": {
        "removeAllLocked": [
          true
        ]
      }
    },
    "elementsToRemove": {
      "comments": "elements to remove when the substance has no public references",
      "type": "array",
      "items": {
        "options": [
          "Names",
          "Codes",
          "Definition",
          "Notes",
          "Relationships",
          "Properties",
          "Modifications"
        
        ],
      },
      "widget": {
        "id": "multi-select"
      },
      "title": "Elements to remove",
      "visibleIf": {
        "removeElementsIfNoExportablePublicRef": [
          true
        ]
      }
    },
    "removeAllLocked": {
      "comments": "When true, remove any data element that is marked as non-public",
      "title": "Remove all Locked",
      "type": "boolean"
    },
    "removeCodesBySystem": {
      "comments": "When true, remove any Codes whose CodeSystem is on the list",
      "title": "Remove Codes by System",
      "type": "boolean"
    },
    "codeSystemsToRemove": {
      "comments": "Code Systems to remove",
      "type": "array",
      "items": {
        "type": "string"
      },
      "title": "Code Systems to Remove",
      "visibleIf": {
        "removeCodesBySystem": [
          true
        ]
      },
      "widget": {
        "id": "multi-select"
      },
      "CVDomain": "CODE_SYSTEM"
    },
    "codeSystemsToKeep": {
      "comments": "Code Systems to keep",
      "type": "array",
      "items": {
        "type": "string"
      },
      "title": "Code Systems to Keep",
      "visibleIf": {
        "removeCodesBySystem": [
          true
        ]
      },
      "widget": {
        "id": "multi-select"
      },
      "CVDomain": "CODE_SYSTEM"
    },
    "removeReferencesByCriteria": {
      "comments": "When true, remove any References that meet specified criteria",
      "title": "Remove References by Criteria",
      "type": "boolean"
    },
    "referenceTypesToRemove": {
      "comments": "Document Types to look at. When a Reference is of that document type, remove it",
      "type": "array",
      "items": {
        "type": "string"
      },
      "title": "Reference Types to Remove",
      "visibleIf": {
        "removeReferencesByCriteria": [
          true
        ]
      },
      "widget": {
        "id": "multi-select"
      },
      "CVDomain": "DOCUMENT_TYPE"
    },
    "citationPatternsToRemove": {
      "comments": "Patterns (RegExes) to apply to Reference citation.  When a citation matches, remove the Reference",
      "type": "string",
      "title": "Citation Patterns to Remove",
      "visibleIf": {
        "removeReferencesByCriteria": [
          true
        ]
      },
      "widget": {
        "id": "multi-select"
      }
    },
    "excludeReferenceByPattern": {
      "comments": "Remove References by looking at citationPatternsToRemove",
      "title": "Exclude Reference by Pattern",
      "type": "boolean",
      "visibleIf": {
        "removeReferencesByCriteria": [
          true
        ]
      }
    },
    "substanceReferenceCleanup": {
      "comments": "When true, next criteria are used to process substance references",
      "type": "boolean",
      "title": "Substance Reference Cleanup"
    },
    "removeReferencesToFilteredSubstances": {
      "comments": "When true, when a substance is removed, remove any references to it",
      "type": "boolean",
      "title": "Remove References to Filtered Substances",
      "visibleIf": {
        "substanceReferenceCleanup": [
          true
        ]
      }
    },
    "removeReferencesToSubstancesNonExportedDefinitions": {
      "comments": "When true, when a substance's definition is removed, remove any references to it",
      "type": "boolean",
      "title": "Remove References to Substances Non-Exported Definitions",
      "visibleIf": {
        "substanceReferenceCleanup": [
          true
        ]
      }
    },
    "removeNotes": {
      "comments": "When true, remove all Notes",
      "type": "boolean",
      "title": "Remove Notes"
    },
    "removeChangeReason": {
      "comments": "When true, delete the 'Change Reason' field",
      "type": "boolean",
      "title": "Remove Change Reason"
    },
    "approvalIdCleanup": {
      "comments": "When true, apply additional criteria to the approvalID field",
      "type": "boolean",
      "title": "Approval Id clean-up"
    },
    "removeApprovalId": {
      "comments": "When true, the record's approval ID (system-generated identifier created when the substance is verified by a second registrar) is removed",
      "type": "boolean",
      "title": "Remove Approval Id",
      "visibleIf": {
        "approvalIdCleanup": [
          true
        ]
      }
    },
    "copyApprovalIdToCode": {
      "comments": "When true, the record's approval ID (system-generated identifier created when the substance is verified by a second registrar) is copied to a code",
      "type": "boolean",
      "title": "Copy Approval Id to code if code not already present",
      "visibleIf": {
        "approvalIdCleanup": [
          true
        ]
      }
    },
    "approvalIdCodeSystem": {
      "comments": "When this parameter has a value, the record's approval ID (system-generated identifier created when the substance is verified by a second registrar) is copied to a code of this specified system",
      "type": "string",
      "title": "Remove Approval Id",
      "visibleIf": {
        "approvalIdCleanup": [
          true
        ]
      }
    },
    "regenerateUUIDs": {
      "comments": "When true, all UUIDs in the object being exported will be given a newly-generated value",
      "type": "boolean",
      "title": "Regenerate UUIDs"
    },
    "changeAllStatuses": {
      "comments": "When true, all status value in the object being exported will be given a value",
      "type": "boolean",
      "title": "Change All Statuses"
    },
    "newStatusValue": {
      "comments": "new string value to assign to all individual status fields throughout the object",
      "type": "string",
      "title": "New Status Value",
      "visibleIf": {
        "changeAllStatuses": [
          true
        ]
      }
    },
    "AuditInformationCleanup": {
      "comments": "When true, apply succeeding criteria to audit fields",
      "type": "boolean",
      "title": "Audit Information clean-up"
    },
    "newAuditorValue": {
      "comments": "new string value to assign to all auditor (creator/modifier) fields throughout the object",
      "title": "New Auditor Value",
      "type": "string",
      "visibleIf": {
        "AuditInformationCleanup": [
          true
        ]
      }
    },
    "scrubbedDefinitionHandling": {
      "comments": "apply some additional scrubbing to definitions that had parts removed",
      "title": "Scrubbed Definition Handling",
      "type": "boolean"
    },
    "removeScrubbedDefinitionalElementsEntirely": {
      "comments": "When a defining element has been modified, remove it entirely",
      "title": "Remove partially/fully scrubbed definitional records entirely",
      "type": "boolean",
      "visibleIf": {
        "scrubbedDefinitionHandling": [
          true
        ]
      }
    },
    "setScrubbedDefinitionalElementsIncomplete": {
      "comments": "When a defining element has been modified, set definitional level to \"Incomplete\"",
      "title": "Set partially/fully scrubbed definitional records to definitional level \"Incomplete\"",
      "type": "boolean",
      "visibleIf": {
        "scrubbedDefinitionHandling": [
          true
        ]
      }
    },
    "convertScrubbedDefinitionsToConcepts": {
      "comments": "When a substance's defining element has been modified, convert the substance type to \"Concept\"",
      "title": "Convert partially/fully scrubbed definitional records to \"Concepts\"",
      "type": "boolean",
      "visibleIf": {
        "scrubbedDefinitionHandling": [
          true
        ]
      }
    },
    "addNoteToScrubbedDefinitions": {
      "comments": "When a substance's defining element has been modified, add a Note",
      "title": "add a note to partially/fully scrubbed definitional records",
      "type": "string",
      "visibleIf": {
        "scrubbedDefinitionHandling": [
          true
        ]
      }
    }
  },
  "required": [],
  "constraints": [
    {
      "if": "removeCodesBySystem",
      "then": {
        "oneOf": [
          [
            "codeSystemsToRemove",
            "codeSystemsToKeep"
          ]
        ]
      }
    },
    {
      "if": "removeAllLocked",
      "then": {
        "oneOf": [
          "accessGroupsToInclude",
          "accessGroupsToRemove"
        ]
      }
    }
  ]
};

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    public substanceService: SubstanceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.testing();
    this.scrubberModel = { };
        this.expanderModel = {};
    this.substanceService.getSchema('scrubber').subscribe(response => {
        console.log(response);
    //  this.mySchema = response;
    console.log(this.mySchema);
    console.log(this.mySchema.properties);
        Object.keys(this.mySchema.properties).forEach(val => {
        //  console.log(val);
        console.log(val);
        if (response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
         //   console.log('found');
            response.properties[vis]['children'] = 1;
          }
        });
          
          
        }
        })
        
    });
    this.substanceService.getSchema('expander').subscribe(response => {
   //   console.log(response);
      this.expanderSchema = response;
      Object.keys(response.properties).forEach(val => {
     //   console.log(response.properties[val]);
        if (response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
         //   console.log('found');
            response.properties[vis]['children'] = 1;
          }
        });
          
          
        }
      })
  });
    const date = new Date();
    if (this.data.type && this.data.type !== null && this.data.type !== '') {
      this.name = this.data.type + '-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    } else {
      this.name = 'export-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    }
      this.extension = this.data.extension;
    //  console.log('using extension: ' + this.data.extension);
  }


  setValue(event: any, model?: string ): void {
    console.log('triggered');
    console.log(event);
    console.log(this.temp);
    if (model && model === 'expander') {
     // console.log(event);
      this.expanderModel = event;
    } else {
    //  this.scrubberModel = event;
    }
  }

  save(): void {
    let response = {
      'name': this.name,
      'id': this.loadedConfig? this.loadedConfig.configurationId : null
    };
    this.dialogRef.close(response);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  test2(): void {
    let response = {
      'name': this.name,
    };
    this.dialogRef.close(response);
  }


  testing() {
    this.substanceService.getConfigs().subscribe(response => {
      this.options = response;
      console.log(response);
      this.privateOptions = response;
    });
  }

  saveConfig() {
    console.log(this.scrubberModel);
    console.log(this.expanderModel);
    this.message = null;
    const test = {"exporterKey":this.configName,
    "scrubberSettings": this.scrubberModel,
    "expanderSettings": this.expanderModel,
    "exporterSettings":null};
    this.substanceService.storeNewConfig(test).subscribe(response => {
      console.log(response);
      if (response.Result) {
        this.message = response.Result;
      }
      this.options.push(test);
      this.loadedConfig = test;
      if (response['Newly created configuration']) {
        this.message = 'Newly created configuration: ' + response['Newly created configuration'];
        this.loadedConfig.configurationId = response['Newly created configuration'];

      }
    });
  }

  updateConfig() {
    this.message = null;
    console.log(this.expanderModel);
    this.loadedConfig.scrubberSettings = this.scrubberModel;
    this.loadedConfig.expanderSettings = this.expanderModel;
    console.log(this.loadedConfig);
    this.substanceService.updateConfig(this.loadedConfig.configurationId, this.loadedConfig).subscribe(response => {
      console.log(response);
      if (response.Result) {
        this.message = response.Result;
      }
    })
  }

  deleteConfig(id?: string) {
    this.message = null;

    if(!id) {
      id = this.loadedConfig.configurationId;
    }
    this.substanceService.deleteConfig(id).subscribe(response => {
      this.substanceService.getConfigs().subscribe(response2 => {
        console.log(response2);
        this.options = response2;
      });
      this.loadedConfig = null;
      console.log(response);
      if (response.Result) {
        this.message = response.Result;
      }
    });
  }

  switchConfig(event: any) {
    console.log(event);
    this.scrubberModel = null;
    this.expanderModel = null;
    this.scrubberModel = {};
    this.expanderModel = {};
    Object.keys(this.scrubberModel).forEach(val => {
      delete this.scrubberModel[val];
    });
    if (event.scrubberSettings) {
    //  this.scrubberModel = event.scrubberSettings;
    }
    if (event.expanderSettings) {
    //  this.expanderModel = event.expanderSettings;
    }
    let testing = {};
    this.privateOptions.forEach(opt =>{
      if (opt.configurationId === event.configurationId) {
        console.log('found');
        console.log(opt);
        this.expanderModel = JSON.parse(JSON.stringify(opt.expanderSettings));
        this.scrubberModel = JSON.parse(JSON.stringify(opt.scrubberSettings));
        testing = opt.scrubberSettings;
        this.temp = opt.scrubberSettings;
        Object.keys(opt.scrubberSettings).forEach(val => {
          this.scrubberModel[val] = opt.scrubberSettings[val];
        });
      }
    })
    this.configName = event.exporterKey;
    setTimeout(()=> {
      console.log(this.scrubberModel);
      this.scrubberModel = testing;
    }, 100);
  }
}

