import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { Editor } from '@gsrs-core/structure-editor';
import * as _ from 'lodash';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


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
  adminPanel?: boolean;



  constructor(
    private CVService: ControlledVocabularyService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<FragmentWizardComponent>,

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
      this.vocabulary.terms.push(this.privateTerm);
      this.CVService.addVocabTerm( this.vocabulary).subscribe (response => {
        if (response.terms && response.terms.length === this.vocabulary.terms.length) {
          this.message = 'Term ' + this.privateTerm.value + ' Added to ' + this.vocabulary.domain + '';
          setTimeout(() => {this.dialogRef.close(this.privateTerm); }, 3000);
        }
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
  }


  molvecUpdate(mol: any) {
    this.editor.setMolecule(mol);
  }

  editorOnLoad(editor: Editor): void {
    this.loadingService.setLoading(false);
    this.editor = editor;
  
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
      let temp = smi.replace(/[^A-Z*]/g, '');
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

  fragmentType(domain: any) {
    let selected = null;
    this.domains.forEach(val => {
      if (val.domain === domain) {
      
        selected = val;
      }
    });
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

    var tt = this.getPossibleSmiles(this.editor.getSmiles());

    

    if (tt.stars.length <= 0) {
      alert('No star atoms specified, expecting:' + rgs.length + ' star atoms');
      return;
    } else if (tt.stars.length != rgs.length) {
      alert('Expected ' + rgs.length + ' star atoms, but found:' + tt.stars.length);
    }

    var smilesforms = tt.eachForm(rgs);
    this.forms = [];
    smilesforms.forEach(form => {

      let temp = {'value':form, 'url':this.CVService.getStructureUrlFragment(form)};
      this.forms.push(temp);
    });

  }

  getFragmentCV() {
    this.CVService.getFragmentCV().subscribe(data => {
      this.dat = {};

     this.domains = data.content;

     if (this.vocab) {
      this.fragmentType(this.vocab);
     }

    
    });
  }
  checkImg(term: any) {
    term.fragmentSrc = this.CVService.getStructureUrlFragment(term.fragmentStructure);
    term.simpleSrc = this.CVService.getStructureUrlFragment(term.simplifiedStructure);

  }
  setTermStructure(structure) {
    this.privateTerm.fragmentStructure = structure;
    this.privateTerm.simplifiedStructure = structure;
    this.checkImg(this.privateTerm);
    this.termUpdated.emit(this.privateTerm);
    this.forms = [];
    if(this.adminPanel) {
      this.dialogRef.close(structure);
    }
  }
}
