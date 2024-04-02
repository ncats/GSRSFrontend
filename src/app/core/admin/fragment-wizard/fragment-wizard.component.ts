import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { Editor } from '@gsrs-core/structure-editor';
import * as _ from 'lodash';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StructureService } from '@gsrs-core/structure';
import { OverlayContainer } from '@angular/cdk/overlay';
import { take } from 'rxjs';


@Component({
  selector: 'app-fragment-wizard',
  templateUrl: './fragment-wizard.component.html',
  styleUrls: ['./fragment-wizard.component.scss']
})
export class FragmentWizardComponent implements OnInit {
  @Output() termUpdated = new EventEmitter();
  private editor: Editor;
  @Input() vocab?: any;
  connectivity: Array<any>;
  dat: any;
  domains: any;
  forms: Array<any> = [];
  term2: any = {value: '', display: ''};
  privateTerm: any = {value: '', display: ''};
  asDialog = false;
  vocabulary: any;
  message: string;
  validationMessages =[];
  adminPanel?: boolean;
smiles?: any;
private overlayContainer: HTMLElement;


  constructor(
    private CVService: ControlledVocabularyService,
    private loadingService: LoadingService,
    private structureService: StructureService,
    public dialogRef: MatDialogRef<FragmentWizardComponent>,
    private overlayContainerService: OverlayContainer,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vocabulary = data.vocabulary;
    this.vocab = data.vocabulary.domain;
    this.privateTerm.value = data.term;
    this.privateTerm.display = data.term;
    this.asDialog = true;
    this.adminPanel = data.adminPanel;
  }
  

  @Input()
  set term(val: any) {
    if (val != null) {
     this.privateTerm = val;
    }
  }

  get standardized(): boolean {
    return this.privateTerm;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    let extant = false;
    this.vocabulary.terms.forEach(term => {
      if (term.value === this.privateTerm.value) {
        extant = true;
      }
    });
    if (!extant) {
      let privateCopy = JSON.parse(JSON.stringify(this.privateTerm));
      delete privateCopy.simpleSrc;
      delete privateCopy.fragmentSrc;
      this.vocabulary.terms.push(privateCopy);
      this.CVService.validateVocab(this.vocabulary).subscribe(response => {
        if(response && response.valid) {
          this.CVService.addVocabTerm( this.vocabulary).subscribe (response => {
            if (response.terms && response.terms.length === this.vocabulary.terms.length) {
              this.message = 'Term ' + this.privateTerm.value + ' Added to ' + this.vocabulary.domain + '';
              setTimeout(() => {this.dialogRef.close(this.privateTerm); }, 3000);
            }
          }, error => {
            this.vocabulary.terms.pop();
            let str = 'Server Error';
          if (error.error && error.error.message) {
            str += ' - ' + error.error.message;
    
          }
         else if(error.message) {
            str += ' - ' + error.message;
          }
          this.message = str;
    
          });

        } else {
          if(response.validationMessages) {
            response.validationMessages.forEach(message => {
              this.validationMessages.push(message);
            });
          }
          this.vocabulary.terms.pop();
        }
      },error => {
        console.log(error);
        this.vocabulary.terms.pop();
        let str = 'Validation Error';
      if (error.error && error.error.message) {
        str += ' - ' + error.error.message;

      }
     else if(error.message) {
        str += ' - ' + error.message;
      }
      this.message = str;

      });
      
    } else {
      this.message = 'Term already exists';
      setTimeout(() => {
        this.message = '';
      }, 1000);
    }
  }

  ngOnInit(): void {    
    if (this.privateTerm.simplifiedStructure) {
      this.privateTerm.simpleSrc = this.CVService.getStructureUrl(this.privateTerm.simplifiedStructure);
  }
  if (this.privateTerm.fragmentStructure) {
    this.privateTerm.fragmentSrc = this.CVService.getStructureUrl(this.privateTerm.fragmentStructure);
  }
  this.overlayContainer = this.overlayContainerService.getContainerElement();

  }


  molvecUpdate(mol: any) {
    this.editor.setMolecule(mol);
  }

  editorOnLoad(editor: Editor): void {
    this.loadingService.setLoading(false);
    this.editor = editor;
    if(this.privateTerm.value && this.privateTerm.value.fragmentStructure) {
      const pos = this.privateTerm.value.fragmentStructure.substring(0, this.privateTerm.value.fragmentStructure.indexOf(' '));
      this.structureService.interpretStructure(pos).subscribe(response => {
        if (response.structure && response.structure.molfile) {

          let test = response.structure.molfile;
          test = test.replace(/ A  /g, ' *  ');
          this.editor.setMolecule(test);
        }
      });
    } else {
     
    }
    setTimeout(() => {
      // re-adjust z-index after editor messes it up
      this.overlayContainer.style.zIndex = '1003';
  
      this.overlayContainer.style.zIndex = '10003';
      });
  }

  getCombination(ll, i) {
    var cur = ll;
    var ret = [];

    for (var i2 = 0; i2 < ll.length; i2++) {
      var elm = i % cur.length;
      ret.push(cur[elm]);
      var rr = [];

      for (var n = 0; n < cur.length; n++) {
        if (n !== elm) {
          rr.push(cur[n]);
        }
      }

      cur = rr;
    }

    return ret;
  }

  fact(i) {
    var t = 1;

    for (; i > 1; i--) {
      t = t * i;
    }

    return t;
  }

  forEachCombination(ll, c) {
    for (var i = 0; i < this.fact(ll.length); i++) {
      c(this.getCombination(ll, i));
    }
  }


  getPossibleSmiles(smi) {

    function getMarkers(smi) {
      let temp = smi.replace(/@H/g, '').replace(/[^A-Z*]/g, '');
      var alias: any = {
        list: []
      };

   

      alias.smiles = smi;
      alias.stars = [];

      alias.add = function (a) {
        alias.list.push(a);

        if (a === '*') {
          alias.stars.push(alias.list.length - 1);
        }
        return alias;
      };

      alias.asAlias = function () {
        return '|$' + alias.list.join(';') + '$|';
      };

      function fact(i) {
        var t = 1;
    
        for (; i > 1; i--) {
          t = t * i;
        }
    
        return t;
      }

      function getCombination(ll, i) {
        var cur = ll;
        var ret = [];
    
        for (var i2 = 0; i2 < ll.length; i2++) {
          var elm = i % cur.length;
          ret.push(cur[elm]);
          var rr = [];
    
          for (var n = 0; n < cur.length; n++) {
            if (n !== elm) {
              rr.push(cur[n]);
            }
          }
    
          cur = rr;
        }
    
        return ret;
      }

      function forEachCombination(ll, c) {
        for (var i = 0; i < fact(ll.length); i++) {
          c(getCombination(ll, i));
        }
      }

      alias.eachForm = function (labs) {
        var tot = [];
        forEachCombination(labs, function (a) {
          for (var i = 0; i < a.length; i++) {
            alias.list[alias.stars[i]] = a[i];
          }

          tot.push(alias.asFullSmiles());
        });
        return tot;
      };

      alias.asFullSmiles = function () {
        return alias.smiles + ' ' + alias.asAlias();
      };

      for (var i in temp) {
        if (temp[i] === '*') {
          alias.add('*');
        } else {
          alias.add('');
        }
      }
      return alias;
    }

    return getMarkers(smi);
  }

  fragmentType(domain: any, current?: any) {
    let selected = null;
    if(!current) {
      this.domains.forEach(val => {
        if (val.domain === domain) {
        
          selected = val;
        }
      });
    } else {
      selected = this.vocabulary;
    }
    var rgs = _.chain(selected.terms).map(function (t) {
      return t.fragmentStructure;
    }).filter(function (t) {
      return typeof t !== 'undefined';
    }).map(function (t) {
      return t.split(' ')[1];
    }).filter(function (t) {
      return typeof t !== 'undefined';
    }).flatMap(function (t) {
      return t.replace(/[|]/g, '').replace(/[$]/g, '').split(';');
    }).uniq().filter(function (t) {
      return t.indexOf('_') == 0;
    }).value();



   let smiles = '';
   this.editor.getMolfile().pipe(take(1)).subscribe(response => {
     smiles = response;
    var tt = this.getPossibleSmiles(this.editor.getSmiles());
    let stars = 0;
    let dom = "";
    // this.vocab is only used when not editing in admin menu, otherwise full vocabulary is sent since it was fetched earlier
    if (this.vocabulary) {
      dom = this.vocabulary.domain;
    } else {
      dom = this.vocab;
    }



    switch (dom) {
      case 'NUCLEIC_ACID_LINKAGE' : stars = 2; break;
      case 'NUCLEIC_ACID_BASE' : stars = 1; break;
      case 'NUCLEIC_ACID_SUGAR' : stars = 3; break;
      case 'AMINO_ACID_RESIDUE' : stars = 2; break;
    }

    if (tt.stars.length <= 0) {
      alert('No star atoms specified, expecting:' + stars + ' star atoms. Use the star atom selector under the periodic table menu to set');
      return;
    } else if (tt.stars.length != stars) {
      alert('Expected ' + stars + ' star atoms, but found:' + tt.stars.length);
    }
    var smilesforms = tt.eachForm(rgs);
    this.forms = [];
    smilesforms.forEach(form => {
      let temp = {'value':form, 'url':this.CVService.getStructureUrl(form)};
      this.forms.push(temp);
    });

  });

  }

  getFragmentCV() {
    this.editor.getSmiles().pipe(take(1)).subscribe(resp => {
      if (resp && resp != '') {
        if(!this.vocabulary) {
          this.CVService.getFragmentCV().subscribe(data => {
            this.dat = {};
      
           this.domains = data.content;
      
           if (this.vocab) {
            this.fragmentType(this.vocab);
           }
      
          
          });
        } else {
          if (this.vocab) {
            this.fragmentType(this.vocab, this.vocabulary);
           }
        }
      } else {
        this.message = "No Structure Detected in editor";
        setTimeout(() => {
          this.message = null;
        }, 4000);
      }
      });
  }
  
  checkImg(term: any) {
    term.fragmentSrc = this.CVService.getStructureUrlFragment(term.fragmentStructure);
    term.simpleSrc = this.CVService.getStructureUrlFragment(term.simplifiedStructure);

  }
  setTermStructure(structure) {
    this.privateTerm.fragmentStructure = structure;
    this.privateTerm.simplifiedStructure = structure.substring(0, structure.indexOf(' '));;
    this.checkImg(this.privateTerm);
    this.termUpdated.emit(this.privateTerm);
    this.forms = [];
    if(this.adminPanel) {
      this.dialogRef.close(structure);
    }
  }
}
