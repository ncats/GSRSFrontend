import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StructureService, StructureImageModalComponent } from '@gsrs-core/structure';
import { ImportDialogComponent } from '@gsrs-core/admin/import-management/import-dialog/import-dialog.component';
import { isString } from 'util';


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
previewLoading = false;
previewLimit = 10;
previewLimitList = [1, 10, 100, 'all'];
toIgnore = [];
fieldList: Array<any>;
extension: string;
executeStatus: string;
executeID:string;
completedRecords: any;
executeLoading = false;
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

createFieldList(values: Array<any>): void {
this.fieldList = [];
  values.forEach(item => {
    let field = "";
    if (item.fieldName) {
      field = item.fieldName;
    } else if(isString(item)) {
      field = item;

    }
   // field = field.replace(/\(/g,"{").replace(/\)/g,"}");
    let temp = {"value":'{{'+field+'}}', "display": field};
   // temp.value = '{{'+field+'}}';
    //temp.display = field;
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

  putSettings(): void {
    this.loadingService.setLoading(true);
    this.step = 4;
    let tosend = JSON.parse(JSON.stringify(this.postResp));
    this.adminService.executeAdapterAsync(this.fileID, tosend, this.adapterKey ).subscribe(response => {
      this.executeStatus = response.jobStatus;
      this.loadingService.setLoading(false);
      this.executeLoading = true;

      this.processingstatus(response.id);
    }, error => {
      this.loadingService.setLoading(false);
      console.log(error);
      alert('Error: see console log for server error');

    });

  }

  processingstatus(id: string): void {
    this.adminService.processingstatus(id).subscribe(response => {
      this.executeStatus = response.statusMessage;
      this.completedRecords = response.completedRecordCount;
      if (response.jobStatus === 'completed') {
        this.executeLoading = false;
      } else {
        setTimeout(() => {
          this.processingstatus(id);
        }, 200);
      }
     

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
    let pos = this.postResp.filename.lastIndexOf(".");
    const newtest = this.postResp.filename.slice(0, pos) + "!" + this.postResp.filename.slice(pos);
    navigationExtras.queryParams = {'facets': 'Source*' + newtest.replace(/^.*[\\\/]/, '') + '.true'};

  }
  this.router.navigate(['/staging-area'], navigationExtras);

}

ImportReload(): void {
  const currentUrl = this.router.url;
        this.router.navigate(['/admin/import']);
}


callPreview(): void {

  const formData = new FormData();
   // this.loadingService.setLoading(true);
   this.previewLoading = true;
    this.previewIndex = 0;
  
    formData.append('file', this.uploadForm.get('file').value);
     formData.append('file-type', this.fileType);
     this.preview = [];
     let tosend = JSON.parse(JSON.stringify(this.postResp));

    this.adminService.previewAdapter(this.fileID, tosend, this.adapterKey, this.previewLimit ).pipe(take(1)).subscribe(response => {
      this.preview = [];
      this.previewLoading = false;
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
      this.previewLoading = false;


    }, error => {
      console.log(error);
    
      this.preview = [];
    
      this.previewLoading = false;

    });
}


replaceAction(s: string) {
  return s && s.replace(' Action','');
}

openImageModal(preview: any): void {

  let data: any;

  if (preview.substanceClass === 'chemical') {
    data = {
      structure: preview.structureID,
      uuid: preview.uuid,
      names: preview.names
    };
  } else {
    data = {
      structure: preview.structureID,
      names: preview.names
    };
  }

  const dialogRef = this.dialog.open(StructureImageModalComponent, {
    width: '670px',
    height: '670px',
    panelClass: 'structure-image-panel',
    data: data
  });

  this.overlayContainer.style.zIndex = '1002';

  const subscription = dialogRef.afterClosed().subscribe(() => {
    this.overlayContainer.style.zIndex = null;
    subscription.unsubscribe();
  }, () => {
    this.overlayContainer.style.zIndex = null;
    subscription.unsubscribe();
  });
}


}
