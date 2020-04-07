import {Component, Inject, OnInit} from '@angular/core';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {SubstanceDetail, SubstanceRelated, SubstanceService} from '@gsrs-core/substance';
import {take} from 'rxjs/operators';
import * as _ from 'lodash';
import * as defiant from '../../../../../node_modules/defiant.js/dist/defiant.min.js';

@Component({
  selector: 'app-merge-concept-dialog',
  templateUrl: './merge-concept-dialog.component.html',
  styleUrls: ['./merge-concept-dialog.component.scss']
})
export class MergeConceptDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<MergeConceptDialogComponent>;
  subconcepts: Array<SubstanceRelated> = [];
  text = 'searching for subconcepts...';
  loading: boolean;
  copy: SubstanceDetail;
  addmergebutton = false;
  showButtons = true;
  showDepricate = false;
  merge = false;
  concept: SubstanceDetail;
  mapName: string;
  oldBdnum: string;

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceService: SubstanceService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getSubconcepts();
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

  getSubconcepts(): void {
    this.loading = true;
    this.substanceService.getSubstanceDetails(this.data.uuid).pipe(take(1)).subscribe(sub => {
      this.copy = sub;
      this.subconcepts = _.chain(sub.relationships).filter(relationship => {
        return relationship.type === 'SUB_CONCEPT->SUBSTANCE';
      }).map(relationship => {
        return relationship.relatedSubstance;
      }).map(relationship => {
        this.substanceService.getBDNUM(relationship).subscribe(resp => {
          relationship['$$bdnum'] = resp;
        });


        return relationship;
      }).value();
      this.loading = false;

      if (this.subconcepts && this.subconcepts.length > 0) {
        this.text = 'Select a Concept to Merge';
      } else {
        this.text = 'No sub-concepts were found for this record';
      }


    });
    this.loading = true;
  }

  mergeTheRecord(uuid: string): void {
    this.loading = true;

    function BDNUM_MAPPER(oldSub) {
      return _.chain(oldSub.codes).filter(function (code) {
        return code.codeSystem === 'BDNUM';
      }).filter(function (code) {
        return code.type === 'PRIMARY';
      }).map(function (code) {
        return code.code;
      }).value()[0];
    }

    this.substanceService.getSubstanceDetails(uuid).subscribe( concept => {
      this.loading = false;
      this.showButtons = false;
      this.concept = concept;
      const newSub = this.scrub(concept);
      const oldSub = this.copy;
      const newBdnum = BDNUM_MAPPER(concept);
      const oldBdnum = BDNUM_MAPPER(oldSub);
      this.mapName = newBdnum + ' MAPS TO ' + oldBdnum + ' ' + oldSub._name;
      this.loading = false;
      if (!confirm('Going to merge names, codes, notes, relationships and references from:' + newBdnum + ' with this record.')) {
        return;
      }

      function addAll(l1, l2) {
        l2.map(function (o) {
          return l1.push(o);
        });
      }

      const bdref = {
        'uuid': this.guid(),
        'docType': 'BDNUM',
        'citation': 'Imported during merging with record:[' + newBdnum + '].',
        'id': newBdnum,
        'publicDomain': false,
        'tags': ['RECORD_MERGE'],
        'access': ['protected']
      };

      const oldref = _.chain(oldSub.relationships).filter(r => {
        return r.relatedSubstance.refuuid === uuid;
      }).value();

      if (oldref.length > 0) {
        oldref[0].relatedSubstance.refPname = this.mapName;
      }


      newSub.relationships = _.chain(newSub.relationships).filter(r => {
        return r.type !== 'SUBSTANCE->SUB_CONCEPT';
      }).value();
      newSub.references.push(bdref);

      for (let i = 0; i < newSub.names.length; i++) {
        if (newSub.names[i].displayName === true) {
          newSub.names[i].displayName = false;
        }
      }

      addAll(oldSub.names, newSub.names.map(n => {
        n.references.push(bdref.uuid);
        return n;
      }));
      addAll(oldSub.codes, newSub.codes.map(n => {
        n.references.push(bdref.uuid);
        return n;
      }));
      addAll(oldSub.notes, newSub.notes.map(n => {
        n.references.push(bdref.uuid);
        return n;
      }));
      addAll(oldSub.relationships, newSub.relationships.map(n => {
        n.references.push(bdref.uuid);
        return n;
      }));
      addAll(oldSub.references, newSub.references);
      oldSub.changeReason = 'Merged with ' + newBdnum;
      // setJson(oldSub);
      this.substanceFormService.loadSubstance(oldSub.substanceClass, oldSub);
      this.addmergebutton = true;
      this.text = 'Fields merged. Click \'Confirm Deprecate old record\' to to prevent duplicate collision';
      this.oldBdnum = oldBdnum;
    });
  }

  mergeConcept(): void {
    this.loading = false;
    const concept = this.concept;
  if (!confirm('Are you sure you want to deprecate the old record? You will still need to submit this new merged record as well.')) {
    this.text = 'Deprecation cancelled. Refresh this page to undo the merge';
    this.loading = false;
    return;
  } else {
    this.text = 'Merging...';
    this.loading = true;
  }

  const depRef = {
    'uuid': this.guid(),
    'docType': 'FDA_SRS',
    'citation': 'Generated as part of migration merge to:' + this.oldBdnum + '.',
    'publicDomain': false,
    'tags': ['RECORD_MERGE'],
    'access': ['protected']
  };
  concept.references.push(depRef);
  concept.names = [{
    // 'language': 'en',
    'name': this.mapName,
    'access': ['admin', 'protected'],
    'references': [depRef.uuid]
  }];
  concept.codes = _.chain(concept.codes).filter(function (c) {
    return c.codeSystem === 'BDNUM';
  }).value();
  concept.notes = [{
    'note': 'Data migrated to record:' + this.oldBdnum
  }];
  concept.relationships = _.chain(concept.relationships).filter(function (r) {
    return r.type === 'SUBSTANCE->SUB_CONCEPT';
  }).value();
  concept.deprecated = true;

  if (!concept.access) {
    concept.access = [];
  }

  concept.access.push('protected');
  concept.changeReason = 'Migrated data into:' + this.oldBdnum;
    this.loading = false;
    this.text = 'Old record deprecated, please save this record to complete merge.';
  this.substanceService.saveSubstance(concept).subscribe(response => {
    this.loading = false;
    this.text = 'Old record deprecated, please save this record to complete merge.';
    this.subconcepts = undefined;
    this.addmergebutton = false;
  }, error => {
    this.loading = false;
    this.text = 'There was a problem deprecating the old record. Refresh the page to undo the changes to the parent record.';
  });
}

  scrub(oldraw: any, importType?: string): SubstanceDetail {
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
    const old = JSON.parse(JSON.stringify(oldraw));
    const uuidHolders = defiant.json.search(old, '//*[uuid]');
    const map = {};
    for (let i = 0; i < uuidHolders.length; i++) {
      const ouuid = uuidHolders[i].uuid;
      if (map[ouuid]) {
        uuidHolders[i].uuid = map[ouuid];
        if (uuidHolders[i].id) {
          uuidHolders[i].id = map[ouuid];
        }
      } else {
        const nid = guid();
        uuidHolders[i].uuid = nid;
        map[ouuid] = nid;
        if (uuidHolders[i].id) {
          uuidHolders[i].id = nid;
        }
      }
    }
    const refHolders = defiant.json.search(old, '//*[references]');
    for (let i = 0; i < refHolders.length; i++) {
      const refs = refHolders[i].references;
      for (let j = 0; j < refs.length; j++) {
        const or = refs[j];
        if (typeof or === 'object') { continue; }
        refs[j] = map[or];
      }
    }
    defiant.json.search(old, '//*[uuid]');
    _.remove(old.codes, {
      codeSystem: 'BDNUM'
    });
    const createHolders = defiant.json.search(old, '//*[created]');
    for (let i = 0; i < createHolders.length; i++) {
      const rec = createHolders[i];
      delete rec['created'];
      delete rec['createdBy'];
      delete rec['lastEdited'];
      delete rec['lastEditedBy'];
    }
    delete old.approvalID;
    delete old.approved;
    delete old.approvedBy;
    old.status = 'pending';
    if ((importType) && (importType === 'definition')) {
      old.names = [];
      old.codes = [];
      old.notes = [];
      old.relationships = [];
    }
    delete old['createdBy'];
    delete old['created'];
    delete old['lastEdited'];
    delete old['lastEditedBy'];
    delete old['version'];
    delete old['$$update'];
    delete old['changeReason'];


    if (true) {
      const refSet = {};

      const refHolders2 = defiant.json.search(old, '//*[references]');
      for (let i = 0; i < refHolders2.length; i++) {
        const refs = refHolders2[i].references;
        for (let j = 0; j < refs.length; j++) {
          const or = refs[j];
          if (typeof or === 'object') { continue; }
          refSet[or] = true;
        }
      }

      const nrefs = _.chain(old.references)
        .filter(function(ref) {
          if (refSet[ref.uuid]) {
            return true;
          } else {
            return false;
          }
        })
        .value();

      old.references = nrefs;

    }


    return old;
  }

  guid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}
