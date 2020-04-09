import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SubstanceDetail, SubstanceService} from '@gsrs-core/substance';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as _ from 'lodash';
import * as defiant from '../../../../../node_modules/defiant.js/dist/defiant.min.js';

@Component({
  selector: 'app-definition-switch-dialog',
  templateUrl: './definition-switch-dialog.component.html',
  styleUrls: ['./definition-switch-dialog.component.scss']
})
export class DefinitionSwitchDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<DefinitionSwitchDialogComponent>;
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
  currentAlts: Array<any>;
  sub: SubstanceDetail;
  fieldGetter: any;
  text: string;

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceService: SubstanceService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

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
    this.uuidNew = this.guid();
    this.newstructureid = this.guid();
    this.structureuuid = this.guid();
    this.structureid = this.guid();
    this.alt = {};

    this.currentAlts = _.chain(this.sub.relationships).filter(function (r) {
      if (r.type === 'SUBSTANCE->SUB_ALTERNATE') {
        return r;
      }
    }).map(function (r) {
      console.log(r);
      return r['relatedSubstance'];
    }).value();

    if (this.currentAlts.length > 0) {

    } else {
      alert('No alternate definitions were found for this record');
    }

  }

  tempPrimeChange(uuid) {
    console.log('temp prime change');
    this.substanceService.getSubstanceDetails(this.sub.uuid).subscribe(c => {
      this.oldPrime = _.cloneDeep(c);
      if (!this.fieldGetter[this.oldPrime.substanceClass]) {
        alert('This substance is incompatible with the definition switch function');
        return;
      } else {
        alert (this.oldPrime.substanceClass);
      }
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
          'uuid': this.guid(),
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
          'molfile': '\n   JSDraw209061916362D\n\n  6  6  0  0  0  0            999 V2000\n   28.8600   -9.2560    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   30.2110   -8.4760    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   30.2110   -6.9160    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   28.8600   -6.1360    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   27.5090   -8.4760    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n   27.5090   -6.9160    0.0000 He  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  1  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  4  6  1  0  0  0  0\nM  END',
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
      this.substanceService.getSubstanceDetails(uuid).subscribe(d => {
        this.oldAlt = _.cloneDeep(d);
        if (!this.fieldGetter[this.oldAlt.substanceClass]) {
          alert('The selected alternative is incompatible with the definition switch function');
          return;
        }
        console.log(this.oldAlt.substanceClass === this.sub.substanceClass);
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

      AltNewType(alt) {
        this.didStep5 = true;
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
                'molfile': '\n   JSDraw209051918142D\n\n  6  6  0  0  0  0            999 V2000\n   17.6800   -3.7440    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   16.3290   -2.9640    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   16.3290   -1.4040    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.6800   -0.6240    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.0310   -1.4040    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.0310   -2.9640    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  6  1  1  0  0  0  0\nM  END',
                'id': this.structureid,
                'references': [this.structureuuid]
              };
            } else {
              console.log('deleting ' + altSwitch.substanceClass + ' adding temporary structurallyDiverse');
              altSwitch.substanceClass = 'structurallyDiverse';
              altSwitch.structurallyDiverse = {
                'uuid': this.guid(),
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

     AltNewDef(alt) {
          this.substanceService.getSubstanceDetails(this.oldAlt.uuid).subscribe(d => {
          alt = _.cloneDeep(d);
          console.log(alt);
          console.log(this.sub);
          console.log('deleting ' + alt.substanceClass + ' adding ' + this.sub.substanceClass);
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
          console.log(altReferences);
          const objectsA = altReferences.filter(e => {
            console.log(e);
            console.log(this._typeof2(e));
            if (this._typeof2(e) === 'object') {
              return true;
            } else {
              return false;
            }
            // return h.isObject;
           // return e.isObject;
          });
          console.log(objectsA);
          const toPush = [];

          for (let i = 0; i < objectsA.length; i++) {
            const current = objectsA[i].references;

            for (let k = 0; k < current.length; k++) {
              for (let l = 0; l < this.sub.references.length; l++) {
                if (this.sub.references[l].uuid === current[k]) {
                  console.log('pushing ' + current[k]);
                  const replace = this.guid();
                  console.log('to ' + replace);
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
            console.log('true');
            alt.references = alt.references.filter(r => {
              if (r.uuid !== this.structureuuid) {
                return r;
              } else {console.log('not adding ' + this.structureuuid)}
            });
          }
          const temp = _.cloneDeep(alt);
          console.log(temp);

          this.updateRecord(alt,  () => {
            this.primeNewDef(alt);
          }, 2);
        });
      }


      primeNewDef(alt) {
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
            const objectsA = subReferences.filter(h => {
              console.log(h);
              console.log(this._typeof2(h));
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
                    const replace = this.guid();
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
              setTimeout(function () {
                alert('Record definitions successfully switched. The page will now refresh. \n\n Please review and remove any unnecessary validation Notes created for each substance during the switch');
                cb();
              }, 1000);
            } else {
              cb();
            }
          },
          error => {
           // $('.loading').finish();
          //  $('.loading').hide();
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
            alert(errorString);
            this.undo(step);
          });
      }

      undo(step) {
        let text = '';

        if (step === 1) {
          this.text = '<h3>There was a problem changing the primary definition.</h3> No changes were made to either record';
        } else if (step === 2 && this.didStep5 === false || step === '2b') {
          this.text = '<h3>There was a problem changing the substance definition.</h3><br/> <b>To Restore the records:</b><br/>' +
            '<ul><li>  Go to <a target = "_blank" href = "app/substance/' + this.sub.uuid + '/v/1#history" >' +
            'the earliest alternative details history</a> and restore version ' + this.altversion + '</a> and click "restore"<br/>' +
            'If that version is not available, go to the <a target = "_blank" href = "app/substance/' + this.sub.uuid + '#history" >' +
            ' current version substance history card </a> and select a previous version to restore </li></ul>';
        } else {
          this.text = '<h3>There was a problem updating the new definition.</h3><br/>' +
            ' <b>To Restore the records:</b><br/><ul><li> Go to ' +
            '<a target = "_blank" href = "app/substance/' + this.alt.uuid + '/v/1#history" >' +
            'the earliest alternative details history</a> and restore version ' + this.altversion + '<br/>' +
            'If that version is not available, go to the <a target = "_blank" href = "app/substance/' + this.alt.uuid + '#history" >' +
            ' current version substance history card </a> and select a previous version to restore </li>' +
            '<li> Go to <a target = "_blank" href = "app/substance/' + this.sub.uuid + '/v/1#history" > ' +
            'the earliest primary version and restore version ' + this.primeVersion + ' <br/>' +
            'If that version is not available, go to the <a target = "_blank" href = "app/substance/' + this.sub.uuid + '#history" >' +
            'current version </a> and select a previous version to restore ';
        }

       /* document.body.appendChild($('<div class="classchng-overlay" style="z-index:999999;position:fixed;top:0px;width:100%;height:100%;background: rgba(0, 0, 0, 0.6);">\n               <div style="padding: 100px;content-align:center">\n                <div style=" background-color:white;max-width:600px;padding:20px;margin:auto;line-height: 24px;">\n                \t<div>' + text + '</div>\n                  <br/>\n                  <div style = \'float:right\'><button class="btn btn-danger classchng-cancel">Close</button></div><br/><br/>\n                </div>\n                </div>\n                </div>\n                ')[0]);
        $('.classchng-cancel').click(function (e) {
          $('.classchng-overlay').remove();
        });*/
      }

      guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : this._typeof2(obj);
      };
    }

    return this._typeof(obj);
  }


}
