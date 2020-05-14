import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubstanceDetail, SubstanceService } from '@gsrs-core/substance';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as defiant from '../../../../../node_modules/defiant.js/dist/defiant.min.js';
import { LoadingService } from '@gsrs-core/loading/index.js';
import { UtilsService } from '@gsrs-core/utils/index.js';

@Component( {
  selector: 'app-definition-switch-dialog',
  templateUrl: './definition-switch-dialog.component.html',
  styleUrls: ['./definition-switch-dialog.component.scss']
})
export class DefinitionSwitchDialogComponent implements OnInit {
  public dialogRef: MatDialogRef <DefinitionSwitchDialogComponent>;
  primeVersion: string;
  altversion = '';
  full_prom = null;
  oldAlt: any = {};
  didStep5 = false;
  oldPrime: any = {};
  uuidNew: string;
  newstructureid: string;
  structureuuid: string;
  structureid: string;
  alt: any = {};
  currentAlts: Array <any>;
  sub: SubstanceDetail;
  fieldGetter: any;
  text: string;
  showButtons = true;
  loading = false;
  error = '';
  test1: any;
  test2: any;

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceService: SubstanceService,
    private sanitizer: DomSanitizer,
    private loadingService: LoadingService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.defSwitch();
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

  defSwitch() {
    this.sub = this.substanceFormService.getJson();

    this.fieldGetter = {
      'protein': ['protein', 'modifications', 'properties'],
      'chemical': ['structure', 'moieties', 'modifications', 'properties'],
      'structurallyDiverse': ['structurallyDiverse', 'modifications', 'properties'],
      'polymer': ['polymer', 'modifications', 'properties'],
      'nucleicAcid': ['nucleicAcid', 'modifications', 'properties'],
      'mixture': ['mixture', 'modifications', 'properties']
    };
    this.primeVersion = this.sub.version;
    this.altversion = '';
    this.full_prom = null;
    this.oldAlt = {};
    this.oldPrime = this.sub;
    this.uuidNew = this.utilsService.newUUID();
    this.newstructureid = this.utilsService.newUUID();
    this.structureuuid = this.utilsService.newUUID();
    this.structureid = this.utilsService.newUUID();
    this.alt = {};

    this.currentAlts = _.chain(this.sub.relationships).filter(function (r) {
      if (r.type === 'SUBSTANCE->SUB_ALTERNATE') {
        return r;
      }
    }).map(function (r) {
      return r['relatedSubstance'];
    }).value();

    if (this.currentAlts.length > 0) {
      this.text = 'Select a substance to switch';
    } else {
      this.text = 'No alternate definitions were found for this record';
    }

  }

  // set primary substance type to different and != alternative
  tempPrimeChange(uuid) {
    if (!confirm("This process involves multiple updates to both records and may take several minutes.\n"+
    "If the switch fails at any stage, follow the instructions that appear to restore both records. \n\n"+
    " Click 'OK' to proceed.")) {
      this.showButtons = true;
        return;
    }
    this.loadingService.setLoading(true);
    this.loading = true;
    this.text = 'Starting step 1';
    this.showButtons = false;
    console.log('Temporarily changing primary type');
    this.substanceService.getSubstanceDetails(this.sub.uuid).subscribe(c => {
      this.oldPrime = _.cloneDeep(c);
      if (!this.fieldGetter[this.oldPrime.substanceClass]) {
        this.text = 'The selected alternative is incompatible with the definition switch function';
        return;
      }
      // delete all old definitional fields
      this.fieldGetter[this.sub.substanceClass].forEach(x => {
        if (this.oldPrime[x]) {
          delete this.oldPrime[x];
        }
      });
      console.log('setting primary to temporary substance type');
      const depRef = {
        'uuid': this.uuidNew,
        'docType': 'FDA_SRS',
        'citation': 'Generated to switch definition type',
        'publicDomain': true,
        'tags': ['RECORD_MERGE', 'PUBLIC DOMAIN RELEASE'],
        'access': []
      };

      if (this.oldPrime.substanceClass !== 'structurallyDiverse') {
        this.oldPrime.substanceClass = 'structurallyDiverse';
        this.oldPrime.structurallyDiverse = {
          'uuid': this.utilsService.newUUID(),
          'created': 1567806115158,
          'createdBy': 'definitionSwitcher',
          'lastEdited': 1567806115158,
          'lastEditedBy': 'definitionSwitcher',
          'sourceMaterialClass': 'Temporary class for definition switch',
          'sourceMaterialType': 'Temporary class for definition switch',
          'part': ['WHOLE'],
          'references': [this.uuidNew]
        };
      } else {
        this.oldPrime.substanceClass = 'chemical';
        this.oldPrime.structure = {
          'opticalActivity': 'none',
          'access': [],
          'molfile': '\n   JSDraw209061916362D\n\n  6  6  0  0  0  0            999 V2000\n   28.8600   -9.2560    '+
          '0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   30.2110   -8.4760    0.0000 He  0  0  0  0  0  0  0  0  0'+
          '  0  0  0\n   30.2110   -6.9160    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   28.8600   -6.1360    0.0000 He'+
          '  0  0  0  0  0  0  0  0  0  0  0  0\n   27.5090   -8.4760    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   27.5090 '+
          '  -6.9160    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  '+
          '0  0\n  1  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  4  6  1  0  0  0  0\nM  END',
          'deprecated': false,
          'digest': '4b4cb19b839f6eb23b836addbaa87729a9632a35',
          'smiles': '[He]1[He][He][He][He][He]1',
          'formula': 'He6',
          'stereoCenters': 0,
          'definedStereo': 0,
          'ezCenters': 0,
          'charge': 0,
          'mwt': 24.015612,
          'count': 1,
          'hash': '3ZYHCH786T4L',
          'stereochemistry': 'ACHIRAL',
          'id': this.newstructureid,
          'references': [this.uuidNew]
        };
      }

      this.oldPrime.references.push(depRef);
      this.test1 =  defiant.json.search(this.oldPrime, '//*[references]');
      this.substanceService.getSubstanceDetails(uuid).subscribe(d => {
        this.test2 =  defiant.json.search(d, '//*[references]');

        this.oldAlt = _.cloneDeep(d);
        if (!this.fieldGetter[this.oldAlt.substanceClass]) {
         this.text = 'The selected alternative is incompatible with the definition switch function';
          return;
        }
        if (this.oldAlt.substanceClass === this.sub.substanceClass) {
          this.updateRecord(this.oldPrime, () => {
            this.AltNewType(this.oldAlt);
          }, 1);
        } else {
          this.updateRecord(this.oldPrime, () => {
            this.AltNewDef(this.oldAlt);
          }, 1);
        }
      });
    });
  }
      // change alt type if it's the same as the primary
      AltNewType(alt) {
        this.didStep5 = true;
        this.text = 'Step 1 complete. Running step 2a...';
        this.substanceService.getSubstanceDetails(this.oldAlt.uuid).subscribe(d => {
            alt = _.cloneDeep(d);

            const altSwitch = _.cloneDeep(d);

            this.fieldGetter[altSwitch.substanceClass].forEach(x => {
              if (alt[x]) {
                delete alt[x];
              }
            });

            if (altSwitch.substanceClass === 'structurallyDiverse') {
              console.log('deleting ' + altSwitch.substanceClass + ' adding temporary chemical');
              altSwitch.substanceClass = 'chemical';
              altSwitch.structure = {
                'opticalActivity': 'none',
                'access': [],
                'molfile': '\n   JSDraw209061916362D\n\n  6  6  0  0  0  0            999 V2000\n   28.8600   -9.2560    '+
                '0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   30.2110   -8.4760    0.0000 He  0  0  0  0  0  0  0  0  0'+
                '  0  0  0\n   30.2110   -6.9160    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   28.8600   -6.1360    0.0000 He'+
                '  0  0  0  0  0  0  0  0  0  0  0  0\n   27.5090   -8.4760    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   27.5090 '+
                '  -6.9160    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  '+
                '0  0  0\n  1  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  4  6  1  0  0  0  0\nM  END',
                                'id': this.structureid,
                'references': [this.structureuuid]
              };
            } else {
              console.log('deleting ' + altSwitch.substanceClass + ' adding temporary structurallyDiverse');
              altSwitch.substanceClass = 'structurallyDiverse';
              altSwitch.structurallyDiverse = {
                'uuid': this.utilsService.newUUID(),
                'created': 1567806115158,
                'createdBy': 'definitionSwitcher',
                'lastEdited': 1567806115158,
                'lastEditedBy': 'definitionSwitcher',
                'deprecated': false,
                'sourceMaterialClass': 'Temporary class for definition switch',
                'sourceMaterialType': 'Temporary class for definition switch',
                'part': ['WHOLE'],
                'references': [this.structureuuid]
              };
            }

            const depRef = {
              'uuid': this.structureuuid,
              'docType': 'FDA_SRS',
              'citation': 'Generated to switch definition type',
              'publicDomain': true,
              'tags': ['RECORD_MERGE', 'PUBLIC DOMAIN RELEASE'],
              'access': []
            };
            altSwitch.references.push(depRef);
            this.updateRecord(altSwitch, () => {
              this.AltNewDef(this.oldAlt);
            }, '2b');
          });
      }

      // set old primary definition info to alternative
     AltNewDef(alt) {
        if (this.didStep5 === true) {
          this.text = 'Step 2a complete. Running step 2b...';

        } else {
          this.text = 'Step 1 complete. Running step 2...';
        }
        // get server version for server-side updates
          this.substanceService.getSubstanceDetails(this.oldAlt.uuid).subscribe(d => {

          alt = _.cloneDeep(d);
          this.fieldGetter[alt.substanceClass].forEach(x => {
            if (alt[x]) {
              delete alt[x];
            }
          });
          this.fieldGetter[this.sub.substanceClass].forEach(x => {
            if (this.sub[x]) {
              alt[x] = this.sub[x];
            }
          });
          alt.substanceClass = this.sub.substanceClass;
          const altReferences = defiant.json.search(alt, '//*[references]');
          altReferences.forEach(e => {
          });
        
          const objectsA = altReferences.filter(e => {
            if (this._typeof2(e) === 'object') {
    
              return true;
            } else {
          
              return false;
            }
          });
          const toPush = [];

          for (let i = 0; i < objectsA.length; i++) {
            const current = objectsA[i].references;

            for (let k = 0; k < current.length; k++) {
              for (let l = 0; l < this.sub.references.length; l++) {
                if (this.sub.references[l].uuid === current[k]) {
                  const replace = this.utilsService.newUUID();
                  current[k] = replace;
                  this.sub.references[l].uuid = replace;
                  toPush.push(this.sub.references[l]);
                }
              }
            }
          }

          toPush.forEach(ref => {
            alt.references.push(ref);
          });

          if (this.didStep5 === true) {
            alt.references = alt.references.filter(r => {
              if (r.uuid !== this.structureuuid) {
                return r;
              }
            });
          }
          const temp = _.cloneDeep(alt);
          if (this.didStep5 === true) {
            this.text = 'Step 2a complete. Sending update for 2b...';
  
          } else {
            this.text = 'Step 1 complete. Sending update for step 2...';
          }
          this.updateRecord(alt,  () => {
            this.primeNewDef(alt);
          }, 2);
        });
      }

      // set primary to alternative definition info
      primeNewDef(alt) {
        this.text = 'Step 2 complete. Running final step...';
        this.substanceService.getSubstanceDetails(this.sub.uuid).subscribe(e => {

          this.substanceService.getSubstanceDetails(this.oldAlt.uuid).subscribe(f => {
            const newSub = _.cloneDeep(e);

            newSub.substanceClass = this.oldAlt.substanceClass;
            this.fieldGetter[newSub.substanceClass].forEach(x => {
              if (newSub[x]) {
                delete newSub[x];
              }
            });
            this.fieldGetter[this.oldAlt.substanceClass].forEach(x => {
              if (this.oldAlt[x]) {
                newSub[x] = this.oldAlt[x];
              }
            });
            const subReferences = defiant.json.search(newSub, '//*[references]');
            subReferences.forEach(e => {
            });
            const objectsA = subReferences.filter(h => {

              if (this._typeof2(h) === 'object') {
                return true;
              } else {
                return false;
              }
             // return h.isObject;
            });
            const toPush = [];

            for (let i = 0; i < objectsA.length; i++) {
              const current = objectsA[i].references;

              for (let k = 0; k < current.length; k++) {
                for (let l = 0; l < this.oldAlt.references.length; l++) {
                  if (this.oldAlt.references[l].uuid === current[k]) {
                    const replace = this.utilsService.newUUID();
                    current[k] = replace;
                    this.oldAlt.references[l].uuid = replace;
                    toPush.push(this.oldAlt.references[l]);
                  }
                }
              }
            }

            toPush.forEach(ref => {
              newSub.references.push(ref);
            });
            newSub.references = newSub.references.filter(r => {
              if (r.uuid !== this.uuidNew) {
                return r;
              }
            });
            this.text = 'Step 2 complete. Sending update for final step...';
            this.updateRecord(newSub,  () => {
               location.reload();
            }, 3);
          });
        });
      }

      updateRecord(nsub, cb, step) {
        console.log('SENDING THE FOLLOWING DATA FOR STEP ' + step);
        console.log(nsub);
        this.substanceService.saveSubstance(nsub).subscribe( data => {
            console.log('SUCCESS ON STEP ' + step + '. Response data:');
            console.log(data);

            if (step === 3) {
              this.text = 'Definitions switched successfully!';
              this.loadingService.setLoading(false);
              this.loading = false;
              setTimeout(function () {
                alert('Record definitions successfully switched. The page will now refresh. '+
                '\n\n Please review and remove any unnecessary validation Notes created for each substance during the switch');
               
                cb();
              }, 1000);
            } else {
              cb();
            }
          },
          error => {
            this.loadingService.setLoading(false);
            this.loading = false;
            console.log('FAILURE - SERVER RESPONSE');
            console.log(error);
            console.log('SENT SUBSTANCE');
            console.log(nsub);
            let errorString = 'VALIDATION ERROR - \n\n';
            if (error && error.error) {
              error.error.validationMessages.forEach( e => {
                if (e.messageType === 'ERROR') {
                  errorString += e.message + '\n\n';
                }
              });
            } else if (error && error.message) {
              errorString += error.message;
            }
            this.error = errorString;
            this.undo(step);
          });
      }

      undo(step) {
        this.text = '';

        if (step === 1) {
          this.text = '<h3>There was a problem changing the primary definition.</h3> No changes were made to either record';
        } else if (step === 2 && this.didStep5 === false || step === '2b') {
          this.text = '<h3>There was a problem changing the substance definition.</h3><br/> <b>To Restore the records:</b><br/>' +
            '<ul><li>  Go to <a target = "_blank" href = "substances/' + this.sub.uuid + '/v/1#history" >' +
            'the earliest alternative details history</a> and restore version ' + this.altversion + '</a> and click "restore"<br/>' +
            'If that version is not available, go to the <a target = "_blank" href = "substances/' + this.sub.uuid + '#history" >' +
            ' current version substance history card </a> and select a previous version to restore </li></ul>';
        } else {
          this.text = '<h3>There was a problem updating the new definition.</h3><br/>' +
            ' <b>To Restore the records:</b><br/><ul><li> Go to ' +
            '<a target = "_blank" href = "substances/' + this.alt.uuid + '/v/1#history" >' +
            'the earliest alternative details history</a> and restore version ' + this.altversion + '<br/>' +
            'If that version is not available, go to the <a target = "_blank" href = "substances/' + this.alt.uuid + '#history" >' +
            ' current version substance history card </a> and select a previous version to restore </li>' +
            '<li> Go to <a target = "_blank" href = "substances/' + this.sub.uuid + '/v/1#history" > ' +
            'the earliest primary version and restore version ' + this.primeVersion + ' <br/>' +
            'If that version is not available, go to the <a target = "_blank" href = "substances/' + this.sub.uuid + '#history" >' +
            'current version </a> and select a previous version to restore ';
        }
      }


      getJson() {
        return this.substanceFormService.getJson();
      }

  _typeof2(obj) {
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      this. _typeof2 = function _typeof2(obj) { return typeof obj; };
    } else {
      this._typeof2 = function _typeof2(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; };
    }
    return this._typeof2(obj);
  }

  _typeof(obj) {
    if (typeof Symbol === 'function' && this._typeof2(Symbol.iterator) === 'symbol') {
      this._typeof = function _typeof(obj) {
        return this._typeof2(obj);
      };
    } else {
      this._typeof = function _typeof(obj) {
        return obj && typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype ? 'symbol' : this._typeof2(obj);
      };
    }

    return this._typeof(obj);
  }


}
