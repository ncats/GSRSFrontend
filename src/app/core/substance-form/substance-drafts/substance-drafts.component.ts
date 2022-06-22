import { Component, OnInit, Inject } from '@angular/core';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UtilsService } from '@gsrs-core/utils';
import { Sort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-substance-drafts',
  templateUrl: './substance-drafts.component.html',
  styleUrls: ['./substance-drafts.component.scss']
})
export class SubstanceDraftsComponent implements OnInit {
  draft: SubstanceDraft;
  displayedColumns: string[] = ['delete', 'type', 'name', 'uuid', 'date', 'load'];

  json: any;
  values: Array<any>;
  filtered: Array<any>;
  onlyRegister = false;
  onlyCurrent = false;
  downloadJsonHref: any;
  fileName: string;
  filename: string;  
  uploadForm: FormGroup;

  file: any;
  uuid: string;
  
  constructor(
    private substanceFormService: SubstanceFormService,
    public dialogRef: MatDialogRef<SubstanceDraftsComponent>,
    private utilsService: UtilsService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  ngOnInit(): void {
    this.json = this.substanceFormService.cleanSubstance();
    this.uuid = this.json.uuid;
    this.fetchDrafts();
    const time = new Date().getTime();
    this.fileName = 'gsrs-drafts-' + time;
    this.download();

    
  }


  download() {
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.values)));
    this.downloadJsonHref = uri;
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  readFile() {
    var reader = new FileReader();
    reader.onload = (e) => {
      const file = e.target.result;
        this.filtered = JSON.parse(<string>file);
        this.values = JSON.parse(<string>file);
    };
    reader.readAsText(this.file);
}


  filterToggle(value:string) {
    if (value === 'register') {
      this.onlyRegister = !this.onlyRegister;
    } else {
      this.onlyCurrent = !this.onlyCurrent;
    }

    this.filtered = this.values;
    if (this.onlyCurrent) {
      this.filtered = this.filtered.filter(obj => {
        if(this.uuid) {
          return obj.uuid == this.uuid;
        } else if (this.json && this.json.uuid){
          return obj.uuid == this.json.uuid;
        } else {
          return false;
        }
    });
    }

    if (this.onlyRegister) {
      this.filtered = this.filtered.filter(function( obj ) {
        return obj.uuid === 'register';
    });
    }

  }


  useDraft(index) {
    this.dialogRef.close(index);
  }


  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
    //  this.filtered = data;
      return;
    }
    const data = this.filtered.slice();
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.utilsService.compare(a[sort.active] ? a[sort.active] : null, b[sort.active] ? b[sort.active] : null, isAsc);
    });
  }

  deleteDraft(draft: any): void {
   localStorage.removeItem(draft.key);
   this.filtered = this.filtered.filter(function( obj ) {
        return obj.key !== draft.key;
    });

   this.values = this.values.filter(function( obj ) {
    return obj.key !== draft.key;
});

  }

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.filename = this.file.name;
    //  this.uploadForm.get('file').setValue(this.file);
      this.readFile()
    }
  }

  openInput(): void {
    document.getElementById('fileInput').click();
  }

  fetchDrafts() {

     this.values = [];
      let keys = Object.keys(localStorage);
      let i = keys.length;
  
      while ( i-- ) {
        if (keys[i].startsWith('gsrs-draft-')){
          const entry = JSON.parse(localStorage.getItem(keys[i]));
          entry.key = keys[i];
          this.values.push( entry );

        }
      }
      this.filtered = this.values.sort((a, b) => {
        return b.date - a.date;
    });;

      if (this.json.uuid) {
        this.filterToggle('substance');
      } else {
        this.filterToggle('register');
      }
  }


  saveDraft() {
    this.json = this.substanceFormService.cleanSubstance();
    const time = new Date().getTime();
    const file = 'gsrs-draft-' + time;
    const uuid = this.json.uuid ? this.json.uuid : 'register';
    const type = this.json.substanceClass;
    let primary = null;
    this.json.names.forEach(name => {
      if (name.displayName) {
        primary = name.name;
      }
    });
    if (!primary && this.json.names.length > 0) {
      primary = name[0].name;
    }

    let draft = {
      'uuid': uuid,
      'date': time,
      'type': type,
      'name': primary,
      'substance': this.json
    }

   localStorage.setItem(file, JSON.stringify(draft));

  }


  
}


export interface SubstanceDraft {
  key: string;
  uuid: any;
  date: string;
  type: string;
  name?: string; 
  substance: any;
  auto?: boolean;
  file?: any;
}