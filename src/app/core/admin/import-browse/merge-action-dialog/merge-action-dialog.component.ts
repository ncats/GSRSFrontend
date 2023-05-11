import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-merge-action-dialog',
  templateUrl: './merge-action-dialog.component.html',
  styleUrls: ['./merge-action-dialog.component.scss']
})
export class MergeActionDialogComponent implements OnInit {
  mergeSchema: any;
  mergeModel = {};
  privateMergeModel = {};
  entity: string;
  matches: any;
  toMerge: string;
  loading = false;
  completed = false;
  mergeResponse: any;
  errors: Array<string> = [];
  success = true;
  constructor(
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.recordId) {
      this.entity = data.recordId;
      this.matches = data.matches;

    }
    if(data.mergeRecord) {
      this.toMerge = data.mergeRecord.uuid;
    }
   }

   select(entry: any) {
    this.toMerge = entry.uuid;
   } 

  ngOnInit(): void {
    this.getMergeSchema();
  }

  getMergeSchema() {
    this.adminService.getMergeActionSchema().subscribe(response => {
      this.mergeSchema = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://gsrs.ncats.nih.gov/#/import.merge.schema.json","title":"Import Merge Parameters","description":"Options when data from one substance is merged into another","type":"object","properties":{"mergeReferences":{"comments":"Copy references from new substance into existing substance","title":"Merge References","type":"boolean"},"mergeNames":{"comments":"Copy names from new substance into existing substance","type":"boolean","title":"Merge Names"},"mergeCodes":{"comments":"Copy codes from new substance into existing substance","type":"boolean","title":"Merge Codes"},"mergeProperties":{"comments":"Copy properties from new substance into existing substance","type":"boolean","title":"Merge Properties"},"mergeNotes":{"comments":"Copy notes from new substance into existing substance","type":"boolean","title":"Merge Notes"},"mergeNotesNoteUniqueness":{"comments":"When merging notes, eliminate duplicates from the new items","type":"boolean","title":"Note uniqueness","visibleIf":{"mergeNotes":[true]}},"mergeRelationships":{"comments":"Copy relationships from new substance into existing substance","type":"boolean","title":"Merge Relationships"},"mergeRelationshipsRelationshipUniqueness":{"comments":"When merging relationship, eliminate duplicates from the new items","type":"boolean","title":"Relationship Uniqueness","visibleIf":{"mergeRelationships":[true]}},"mergeModifications":{"comments":"Copy modifications from new substance into existing substance (see separate selections for Agent, Structural and Physical)","type":"boolean","title":"Copy modifications from new substance into existing substance"}},"mergeModificationsMergeStructuralModifications":{"comments":"When merging modifications, include structural modifications","type":"boolean","title":"Merge Structural Modifications","visibleIf":{"mergeModifications":[true]}},"mergeModificationsMergeAgentModifications":{"comments":"When merging modifications, include agent modifications","type":"boolean","title":"Merge Agent Modifications","visibleIf":{"mergeModifications":[true]}},"mergeModificationsMergePhysicalModifications":{"comments":"When merging modifications, include physical modifications","type":"boolean","title":"Merge Physical Modifications","visibleIf":{"mergeModifications":[true]}},"skipLevelingReferences":{"comments":"When merging codes, names, properties, etc., skip the step of copying references attached to these things","type":"boolean","title":"Skip Leveling References"},"required":[],"constraints":[{"if":"removeCodesBySystem","then":{"oneOf":[["removeCodesBySystemCodeSystemsToRemove","removeCodesBySystemCodeSystemsToKeep"]]}}]};
    });
  }

  checkValue(event: any) {
    this.privateMergeModel = event;
  }

  submit() {
    this.loading =true;
    this.adminService.stagedRecordSingleAction(this.entity, 'merge', this.privateMergeModel, this.toMerge).subscribe(response => {
      this.refresh(response.id);
    }, error => {
    this.loading = false;
    })
  }

    refresh(id: string): void {
      this.adminService.processingstatus(id).subscribe(response => {
        if (response.results) {
          response.results.forEach(result => {
            if(result.status === "INTERNAL_SERVER_ERROR") {
              this.success = false;
              let temp = result.message;
              if (result.error) {
                temp += ". " + result.error;
              }
              this.errors.push(temp);
            }
          });
        }
        if (response.jobStatus === 'completed') {
          
          this.loading = false;
          this.completed = true;
        } else {
          setTimeout(() => {
            this.refresh(id);
          }, 200);
        }
       
  
      });
    }
  }


