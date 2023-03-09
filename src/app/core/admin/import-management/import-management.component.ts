import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StructureService } from '@gsrs-core/structure';
import { ImportDialogComponent } from '@gsrs-core/admin/import-management/import-dialog/import-dialog.component';


@Component({
  selector: 'app-import-management',
  templateUrl: './import-management.component.html',
  styleUrls: ['./import-management.component.scss']
})
export class ImportManagementComponent implements OnInit {
demo: any;
uploadForm: FormGroup;
filename: string;
fileType: string;
audit = false;
processing = false;
message: string;
adapterSettings: any = null;
adapterKey: string;
settingsIndex: number;
settingsActive: any;
step = 1;
private overlayContainer: HTMLElement;
postResp: any;
save = false;
preview: any;
fileID: string;
previewDemo: any;
previewIndex = 0;
previewTotal = 0;
toIgnore = [];
fieldList: Array<any>;
extension: string;
constructor(
  public formBuilder: FormBuilder,
  public adminService: AdminService,
  private router: Router,
  private route: ActivatedRoute,
  private loadingService: LoadingService,
  private overlayContainerService: OverlayContainer,
  private dialog: MatDialog,
  private structureService: StructureService

  


) { }

setAdapter(event?: any) {
    this.adapterKey = event.value;
    
    this.demo.forEach(val => {
        if (val.adapterKey === event.value) {
            this.adapterSettings = val.parameters;
        }
    });

}

createFieldList(values: Array<string>): void {
this.fieldList = [];
  values.forEach(item => {
    item = item.replace(/\(/g,"{").replace(/\)/g,"}");
    let temp = {value: null, display: null};
    temp.value = '{{'+item+'}}';
    temp.display = item;
    this.fieldList.push(temp);
  });
}

openAction(templateRef:any, index: number): void  {
  this.save = false;
    this.settingsActive = this.postResp.adapterSettings.actions[index];



    const dialogref = this.dialog.open(ImportDialogComponent, {
      minHeight: '500px',
      width: '800px',
      data: {
        settingsActive: JSON.parse(JSON.stringify(this.postResp.adapterSettings.actions[index])),
        fieldList: this.fieldList
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogref.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;

      if(result) {
        this.postResp.adapterSettings.actions[index] = result;
      }
      
    });
}

changePreview(direction: string) {
  if (direction === 'back') {
    this.previewIndex-=1;
  } else {
    this.previewIndex += 1;
  }
  if (this.preview[this.previewIndex].data.structure && this.preview[this.previewIndex].data.structure.molfile) {
    this.structureService.interpretStructure(this.preview[this.previewIndex].data.structure.molfile).subscribe(response => {
      this.preview[this.previewIndex].data.structureID = response.structure.id;
    });
  } else {
    console.log('false');
  }
  
}

ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();


  this.uploadForm = this.formBuilder.group({
    file: [''],
    fileType: ['SDF']  });
  this.fileType = 'SDF';

  this.adminService.getAdapters().subscribe(result => {
      if(result) {
     //   this.setDemo();
     this.demo = result;
      } else {
        alert('adapters set but invalid response');
      }
      this.getExtensions();

  }, error => {
      alert('failed to fetch adapters. error in console');
    this.getExtensions();


  });
  


}

  close(param?: string) {
    if (!param) {
      param = null;
    } else {
      this.save = true;
    }
    this.dialog.closeAll();
  }

  getExtensions() {
    let extArr = [];

    this.demo.forEach(entry => {
      entry.fileExtensions.forEach(ext => {
        if (!extArr.includes(ext)) {
          extArr.push(ext);
        }
      });
    });
      this.extension = "";
     for (let i = 0; i < extArr.length; i++) {
       this.extension += "." + extArr[i];
        if (i !== extArr.length - 1) {
          this.extension += ", ";
        }
     }
  }


  onSubmit() {
    const formData = new FormData();
    this.loadingService.setLoading(true);
  
    formData.append('file', this.uploadForm.get('file').value);
     formData.append('file-type', this.fileType);
    this.adminService.postAdapterFile(formData, this.adapterKey).pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);
     this.step = 3;
      this.postResp = response;
      this.fileID = response.id;
      this.postResp.adapterSettings.actions.forEach(action => {
        this.toIgnore[action.fileField] = false;
      });
      if (this.postResp.adapterSchema.fields) {
        this.createFieldList(this.postResp.adapterSchema.fields);
      } else if (this.postResp.adapterSchema['SDF Fields']) {
        this.createFieldList(this.postResp.adapterSchema['SDF Fields']);
      }
    
     // this.adapterSettings = response.adapterSettings;
   }, error => {
    this.message = 'File could not be uploaded';
    alert('error in upload call, continuing with non-api demo. Error in console');
    this.step = 3;
    this.fileID = this.postResp.id;
    this.loadingService.setLoading(false);
    if (this.postResp.adapterSchema.fields) {
      this.createFieldList(this.postResp.adapterSchema.fields);
    } else if (this.postResp.adapterSchema['SDF Fields']) {
      this.createFieldList(this.postResp.adapterSchema['SDF Fields']);
    }
   });
  }

  putTest(): void {
    this.loadingService.setLoading(true);
    this.step = 4;
    let tosend = JSON.parse(JSON.stringify(this.postResp));
    this.adminService.executeAdapter(this.fileID, tosend, this.adapterKey ).subscribe(response => {
      this.loadingService.setLoading(false);

    }, error => {
      this.loadingService.setLoading(false);

    });

  }


onFileSelect(event): void {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.filename = file.name;
    this.uploadForm.get('file').setValue(file);

  }
}

openInput(): void {
  document.getElementById('fileInput').click();
}

stagingArea(sendFile?: boolean): void {
  let navigationExtras: NavigationExtras = {queryParams: {}};
  if(sendFile) {
    navigationExtras.queryParams = {'facets': 'Source*' + this.postResp.filename.replace(/^.*[\\\/]/, '') + '.true'};

  }
  this.router.navigate(['/staging-area'], navigationExtras);

}

ImportReload(): void {
  const currentUrl = this.router.url;
        this.router.navigate(['/admin/import']);
}


callPreview(): void {

  const formData = new FormData();
    this.loadingService.setLoading(true);
    this.previewIndex = 0;
  
    formData.append('file', this.uploadForm.get('file').value);
     formData.append('file-type', this.fileType);
     this.preview = [];
     let tosend = JSON.parse(JSON.stringify(this.postResp));

    this.adminService.previewAdapter(this.fileID, tosend, this.adapterKey ).pipe(take(1)).subscribe(response => {
      this.preview = [];
      response.dataPreview.forEach(entry => {
       
      if (entry.data) {
        this.preview.push(entry);
        this.previewTotal = this.preview.length;
      }
        
    });
    if (this.preview[0].data.structure) {
      this.structureService.interpretStructure(this.preview[0].data.structure.molfile).subscribe(response => {
        this.preview[0].data.structureID = response.structure.id;
      });
    }
      this.loadingService.setLoading(false);

    }, error => {
      console.log(error);
    
      this.preview = [];
      this.previewDemo.dataPreview.forEach(entry => {
        if (entry.data) {
          this.preview.push(entry);
          this.previewTotal = this.preview.length;
        }
          
      });
      if (this.preview[0].data.structure) {
        this.structureService.interpretStructure(this.preview[0].data.structure.molfile).subscribe(response => {
          this.preview[0].data.structureID = response.structure.id;
        });
      }
       
      this.previewTotal = this.preview.length;
     this.loadingService.setLoading(false);

    });
}


replaceAction(s: string) {
  return s && s.replace(' Action','');
}
}
