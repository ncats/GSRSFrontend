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
  model = {};
  

 mySchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "Factors that control the behavior of a Java class that removes private parts of a data object before the object is shared",
  "title": "Scrubber Parameters",
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
   
    "removeAllLocked": {
      "comments": "When true, remove any data element that is marked as non-public",
      "title": "Remove all Locked",
      "type": "boolean",
      "children": 4
    },
    "deidentifiedReferencePatterns": {
      "comments": "References to replace (pattern applies to document type)",
      "type": "string",
      "title": "Deidentified Reference Patterns",
      "visibleIf": {
        "removeAllLocked": [
          true
        ]
      }
    },
    "accessGroupsToInclude": {
      "comments": "names of access groups to that will NOT be removed ",
      "type": "string",
      "title": "Access Groups to Include",
      "visibleIf": {
        "removeAllLocked": [
          true
        ]
      }
    },
    "accessGroupsToRemove": {
      "comments": "names of access groups to that WILL be removed ",
      "type": "string",
      "title": "Access Groups to Remove",
      "visibleIf": {
        "removeAllLocked": [
          true
        ]
      }
    },
    "removeElementsIfNoExportablePublicRef": {
      "comments": "elements to remove when they have no public references",
      "type": "string",
      "title": "Remove Elements if no exportable selected public domain reference",
      "visibleIf": {
        "removeAllLocked": [
          true
        ]
      }
    },
   
    "removeCodesBySystem": {
      "comments": "When true, remove any Codes whose CodeSystem is on the list",
      "title": "Remove Codes by System",
      "type": "boolean",
      "children": 4
    },
    "codeSystemsToRemove": {
      "comments": "Code Systems to remove",
      "type": "string",
      "title": "Code Systems to Remove",
      "visibleIf": {
        "removeCodesBySystem": [
          true
        ]
      }
    },
    "codeSystemsToKeep": {
      "comments": "Code Systems to keep",
      "type": "string",
      "title": "Code Systems to Keep",
      "visibleIf": {
        "removeCodesBySystem": [
          true
        ]
      }
    },
    "removeReferencesByCriteria": {
      "comments": "When true, remove any References that meet specified criteria",
      "title": "Remove References by Criteria",
      "type": "boolean",
      "children": 4
    },
    "referenceTypesToRemove": {
      "comments": "Document Types to look at.  When a Reference is of that document type, remove it",
      "type": "string",
      "title": "Reference Types to Remove",
      "visibleIf": {
        "removeReferencesByCriteria": [
          true
        ]
      }
    },
    "citationPatternsToRemove": {
      "comments": "Patterns (RegExes) to apply to Reference citation.  When a citation matches, remove the Reference",
      "type": "string",
      "title": "Citation Patterns to Remove",
      "visibleIf": {
        "removeReferencesByCriteria": [
          true
        ]
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
      "title": "Substance Reference Cleanup",
      "children": 4
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
        "usbstanceReferenceCleanup": [
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
      "title": "Approval Id clean-up",
      "children": 4
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
    "approvalIdCodeSystem": {
      "comments": "When this parameter has a value, the record's approval ID (system-generated identifier created when the substance is verified by a second registrar) is copied to a code of this specified system",
      "type": "string",
      "title": "Remove Approval Id by Code",
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
      "title": "Change All Statuses",
      "children": 4
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
      "title": "Audit Information clean-up",
      "children": 4
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
    "removeAllEntryTimestamps": {
      "comments": "remove created and modified date fields",
      "title": "Remove all entry timestamps",
      "type": "boolean",
      "visibleIf": {
        "AuditInformationCleanup": [
          true
        ]
      }
    },
    "scrubbedDefinitionHandling": {
      "comments": "apply some additional scrubbing to definitions that had parts removed",
      "title": "Scrubbed Definition Handling",
      "type": "boolean",
      "children": 4
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
  "$id": "https://gsrs.ncats.nih.gov/#/export.scrubber.schema.json"
}

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    public substanceService: SubstanceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.substanceService.getSchema().subscribe(response => {
        console.log(response);
        this.model = { removeNotes: true, approvalIdCleanup: true, approvalIdCodeSystem: "test" };
    });
    const date = new Date();
    if (this.data.type && this.data.type !== null && this.data.type !== '') {
      this.name = this.data.type + '-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    } else {
      this.name = 'export-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    }
      this.extension = this.data.extension;
      console.log('using extension: ' + this.data.extension);
  }


  setValue(event: any): void {
    console.log(event);
  }

  save(): void {
   /// this.dialogRef.close(this.name);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}

