import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UploadObject } from '@gsrs-core/admin/admin-objects.model';
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
demoResp: any;
save = false;
preview: any;
fileID: string;
previewDemo: any;
previewIndex = 0;
previewTotal = 0;

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
    console.log("setting adapter as:" + event.value);
    this.adapterKey = event.value;
    
    this.demo.forEach(val => {
        if (val.adapterKey === event.value) {
            this.adapterSettings = val.parameters;
            console.log(this.adapterSettings);
        }
    });

}

openAction(templateRef:any, index: number):void  {
  this.save = false;
  console.log(this.demoResp);
    this.settingsActive = this.demoResp.adapterSettings.actions[index];
    console.log('template opened for adapter of index ' + index);
    console.log(this.settingsActive.actionParameters);

    const dialogref = this.dialog.open(ImportDialogComponent, {
      minHeight: '500px',
      width: '800px',
      data: {
        settingsActive: this.settingsActive
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        this.overlayContainer.style.zIndex = null;
        this.demoResp.adapterSettings.actions[index] = result;
        console.log('new adapter settings set:');
        console.log(this.demoResp.adapterSettings.actions[index]);
      } else {
        console.log('closed without saving');
      }
      console.log(result);
      
    });
}

changePreview(direction: string) {
  if (direction === 'back') {
    this.previewIndex-=1;
  } else {
    this.previewIndex += 1;
  }
  if (this.preview[this.previewIndex].data.structure && this.preview[this.previewIndex].data.structure.molfile) {
    console.log('true');
    this.structureService.interpretStructure(this.preview[this.previewIndex].data.structure.molfile).subscribe(response => {
      console.log(response);
      this.preview[this.previewIndex].data.structureID = response.structure.id;
      console.log(this.preview[this.previewIndex].data.structureID);
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
      console.log('successfully fetched adapters');
      console.log(result);
      if(result) {
     //   this.setDemo();
     this.demo = result;
      } else {
        alert('adapters set but invalid response');
        this.setDemo();
      }

  }, error => {
      alert('failed to fetch adapters, using demo vals. error in console');
      console.log(error);
    this.setDemo();
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


  onSubmit() {
    const formData = new FormData();
    this.loadingService.setLoading(true);
  
    formData.append('file', this.uploadForm.get('file').value);
     formData.append('file-type', this.fileType);
      console.log(this.uploadForm.get('file').value);
     console.log('sending to api service adapter:' + this.adapterKey);
    this.adminService.postAdapterFile(formData, this.adapterKey).pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);
     this.step = 3;
      this.demoResp = response;
      this.fileID = response.id;
    
     // this.adapterSettings = response.adapterSettings;
   }, error => {
    this.message = 'File could not be uploaded';
    console.log(error);
    alert('error in upload call, continuing with non-api demo. Error in console');
    this.step = 3;
    this.fileID = this.demoResp.id;
    this.loadingService.setLoading(false);
   });
  }

  putTest(): void {
    this.loadingService.setLoading(true);
    this.step = 4;
   /* this.adminService.putAdapter(this.demoResp).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });*/
    this.loadingService.setLoading(false);

  }


onFileSelect(event): void {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.filename = file.name;
    this.uploadForm.get('file').setValue(file);
   // console.log(file);
   // this.step = 2;

  }
}

openInput(): void {
  document.getElementById('fileInput').click();
}

stagingArea(): void {
  const navigationExtras: NavigationExtras = {
    queryParams: {}
  };
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
   //   console.log(this.uploadForm.get('file').value);
  //   console.log('sending to api service adapter:' + this.fileID);
     this.preview = [];

    this.adminService.previewAdapter(this.fileID, this.demoResp, this.adapterKey ).pipe(take(1)).subscribe(response => {
      console.log(response);
      this.preview = [];
      
     // console.log(this.previewTotal);
      response.dataPreview.forEach(entry => {
     //   console.log(entry);
        if (entry.data && entry.data.structure) {
          console.log('has structure, calling interpret');
          this.structureService.interpretStructure(entry.data.structure.molfile).subscribe(response => {
            entry.data.structureID = response.structure.id;
            console.log(response);
            console.log('above is interpret response, below is set ID')
            console.log(entry.data.structureID);
            this.preview.push(entry);
            this.previewTotal = this.preview.length;

          });
       
        } else {
          if (entry.data) {
            this.preview.push(entry);
            this.previewTotal = this.preview.length;
          }
        }
      console.log(this.preview);
    });
      this.loadingService.setLoading(false);

    }, error => {
      console.log(error);
    
    //  console.log(this.preview);
      this.preview = [];
      
      this.previewDemo.dataPreview.forEach(entry => {
        if (entry.data && entry.data.structure) {
          console.log('error processing: has structure, calling interpret');
          this.structureService.interpretStructure(entry.data.structure.molfile).subscribe(response => {
            entry.data.structureID = response.structure.id;
            console.log(response);
            console.log('above is interpret response, below is set ID')
            console.log(entry.data.structureID);
            this.preview.push(entry);
            this.previewTotal = this.preview.length;

          });
         console.log(this.preview);
       
        } else {
          if (entry.data) {
            this.preview.push(entry);
            this.previewTotal = this.preview.length;
          }
        }
       
      });
      this.previewTotal = this.preview.length;
;      this.loadingService.setLoading(false);

    });
}




setDemo() {
    this.demo = [
        {
          "adapterName": "NSRS SDF Adapter",
          "adapterKey": "SDF-NSRS",
          "fileExtensions": [
            "sdf",
            "sd"
          ],
          "parameters": {
            "fileImportActions": [
              {
                "label": "Create CAS Code",
                "parameters": {
                  "codeSystem": "CAS"
                },
                "fields": [
                  {
                    "fieldName": "code",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "CAS Number"
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldName": "codeType",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "PRIMARY",
                    "fieldLabel": "Primary or Alternative"
                  }
                ],
                "actionName": "cas_import",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.NSRSCustomCodeExtractorActionFactory"
              },
              {
                "fields": [
                  {
                    "fieldName": "code",
                    "required": true,
                    "fieldLabel": "NCI Number",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldName": "codeType",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "PRIMARY",
                    "fieldLabel": "Primary or Alternative"
                  }
                ],
                "label": "Create NCI Code",
                "parameters": {
                  "codeSystem": "NCI"
                },
                "actionName": "nci_import",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.NSRSCustomCodeExtractorActionFactory"
              },
              {
                "actionClass": "gsrs.module.substance.importers.importActionFactories.StructureExtractorActionFactory",
                "fields": [
                  {
                    "required": true,
                    "fieldName": "molfile",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Structure"
                  }
                ],
                "label": "Create Structure",
                "actionName": "structure_and_moieties"
              },
              {
                "actionClass": "gsrs.module.substance.importers.importActionFactories.ReferenceExtractorActionFactory",
                "label": "Create Reference",
                "actionName": "public_reference",
                "fields": [
                  {
                    "required": true,
                    "fieldName": "docType",
                    "defaultValue": "CATALOG",
                    "fieldLabel": "Type",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true
                  },
                  {
                    "defaultValue": "{INSERT REFERENCE CITATION HERE}",
                    "fieldLabel": "Reference",
                    "fieldName": "citation",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "required": false
                  }
                ]
              },
              {
                "fields": [
                  {
                    "fieldName": "code",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Code"
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldName": "codeType",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "PRIMARY",
                    "fieldLabel": "Primary or Alternative"
                  },
                  {
                    "fieldName": "codeSystem",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Code System"
                  }
                ],
                "actionName": "code_import",
                "label": "Create Code",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.CodeExtractorActionFactory"
              },
              {
                "label": "Create Name",
                "actionName": "common_name",
                "fields": [
                  {
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Name",
                    "fieldName": "name"
                  },
                  {
                    "fieldName": "nameType",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "cn",
                    "fieldLabel": "Name Type"
                  }
                ],
                "actionClass": "gsrs.module.substance.importers.importActionFactories.NameExtractorActionFactory"
              },
              {
                "fields": [
                  {
                    "required": true,
                    "fieldLabel": "Property Name",
                    "fieldType": "java.lang.String",
                    "fieldName": "name",
                    "expectedToChange": false
                  },
                  {
                    "fieldName": "propertyType",
                    "fieldLabel": "Property Type",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "defaultValue": "physical",
                    "required": false
                  }
                ],
                "label": "Create Physical Property",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.PropertyExtractorActionFactory",
                "actionName": "property_import"
              },
              {
                "fields": [
                  {
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Name",
                    "fieldName": "name"
                  },
                  {
                    "defaultValue": "chemical",
                    "fieldName": "propertyType",
                    "fieldLabel": "Property Type",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "required": false
                  },
                  {
                    "fieldName": "valueAverage",
                    "expectedToChange": true,
                    "fieldType": "java.lang.Double",
                    "required": false,
                    "fieldLabel": "Average Value"
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldLabel": "Non-numeric Value",
                    "expectedToChange": true,
                    "fieldName": "valueNonNumeric",
                    "required": false
                  },
                  {
                    "fieldName": "valueUnits",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Units",
                    "required": false
                  }
                ],
                "label": "Create Chemical Property",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.PropertyExtractorActionFactory",
                "actionName": "create_property"
              }
            ]
          },
          "description": "SD File Importer specific to internal workflow"
        },
        {
          "adapterName": "SDF Adapter",
          "adapterKey": "SDF",
          "fileExtensions": [
            "sdf",
            "sd",
            "sdfile"
          ],
          "parameters": {
            "fileImportActions": [
              {
                "label": "Create CAS Code",
                "parameters": {
                  "codeSystem": "CAS"
                },
                "fields": [
                  {
                    "fieldName": "code",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "CAS Number"
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldName": "codeType",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "PRIMARY",
                    "fieldLabel": "Primary or Alternative"
                  }
                ],
                "actionName": "cas_import",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.NSRSCustomCodeExtractorActionFactory"
              },
              {
                "parameters": {
                  "codeSystem": "NSC"
                },
                "label": "Create NSC Code",
                "fields": [
                  {
                    "fieldName": "code",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "NSC Number"
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldName": "codeType",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "PRIMARY",
                    "fieldLabel": "Primary or Alternative"
                  }
                ],
                "actionName": "nci_import",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.NSRSCustomCodeExtractorActionFactory"
              }
            ]
          },
          "description": "SD file importer for general users"
        },
        {
          "adapterName": "Delimited Text Adapter",
          "adapterKey": "DelimitedText",
          "fileExtensions": [
            "txt",
            "csv",
            "tsv"
          ],
          "parameters": {
            "fileImportActions": [
              {
                "fields": [
                  {
                    "fieldName": "code",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Code/Identifier"
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldName": "codeType",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "PRIMARY",
                    "fieldLabel": "Primary or Alternative"
                  },
                  {
                    "fieldName": "codeSystem",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Code System"
                  }
                ],
                "actionName": "code_import",
                "label": "Create Code",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.CodeExtractorActionFactory"
              },
              {
                "fields": [
                  {
                    "required": true,
                    "fieldLabel": "Substance Name",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldName": "Name"
                  },
                  {
                    "fieldName": "nameType",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "required": false,
                    "cv": "names.type",
                    "defaultValue": "cn",
                    "fieldLabel": "Name Type"
                  }
                ],
                "label": "Create Name",
                "actionName": "common_name",
                "parameters": {
                  "lang": "en"
                },
                "actionClass": "gsrs.module.substance.importers.importActionFactories.NameExtractorActionFactory"
              },
              {
                "fields": [
                  {
                    "required": true,
                    "fieldType": "java.lang.String",
                    "fieldLabel": "Protein Sequence",
                    "expectedToChange": true,
                    "fieldName": "proteinSequence"
                  }
                ],
                "parameters": {
                  "subunitDelimiter": "\\|"
                },
                "actionName": "protein_import",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.ProteinSequenceExtractorActionFactory",
                "label": "Create Protein Sequence"
              },
              {
                "actionClass": "gsrs.module.substance.importers.importActionFactories.ReferenceExtractorActionFactory",
                "label": "Create Reference",
                "fields": [
                  {
                    "required": true,
                    "fieldName": "docType",
                    "fieldLabel": "Type",
                    "defaultValue": "OTHER",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true
                  },
                  {
                    "defaultValue": "{INSERT REFERENCE CITATION HERE}",
                    "fieldLabel": "Reference",
                    "fieldName": "citation",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "required": false
                  }
                ],
                "actionName": "public_reference"
              }
            ],
            "lineValueDelimiter": ","
          },
          "description": "text file importer"
        },
        {
          "adapterName": "Excel File Adapter",
          "adapterKey": "ExcelSpreadsheet",
          "fileExtensions": [
            "xlsx"
          ],
          "parameters": {
            "fileImportActions": [
              {
                "fields": [
                  {
                    "fieldName": "code",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Code/Identifier"
                  },
                  {
                    "fieldType": "java.lang.String",
                    "fieldName": "codeType",
                    "expectedToChange": true,
                    "required": false,
                    "defaultValue": "PRIMARY",
                    "fieldLabel": "Primary or Alternative"
                  },
                  {
                    "fieldName": "codeSystem",
                    "required": true,
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldLabel": "Code System"
                  }
                ],
                "actionName": "code_import",
                "label": "Create Code",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.CodeExtractorActionFactory"
              },
              {
                "fields": [
                  {
                    "required": true,
                    "fieldLabel": "Substance Name",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "fieldName": "Name"
                  },
                  {
                    "fieldName": "nameType",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "required": false,
                    "cv": "names.type",
                    "defaultValue": "cn",
                    "fieldLabel": "Name Type"
                  }
                ],
                "label": "Create Name",
                "actionName": "common_name",
                "parameters": {
                  "lang": "en"
                },
                "actionClass": "gsrs.module.substance.importers.importActionFactories.NameExtractorActionFactory"
              },
              {
                "fields": [
                  {
                    "required": true,
                    "fieldType": "java.lang.String",
                    "fieldLabel": "Protein Sequence",
                    "expectedToChange": true,
                    "fieldName": "proteinSequence"
                  }
                ],
                "parameters": {
                  "subunitDelimiter": "\\|"
                },
                "actionName": "protein_import",
                "actionClass": "gsrs.module.substance.importers.importActionFactories.ProteinSequenceExtractorActionFactory",
                "label": "Create Protein Sequence"
              },
              {
                "actionClass": "gsrs.module.substance.importers.importActionFactories.ReferenceExtractorActionFactory",
                "label": "Create Reference",
                "fields": [
                  {
                    "required": true,
                    "fieldName": "docType",
                    "fieldLabel": "Type",
                    "defaultValue": "OTHER",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true
                  },
                  {
                    "defaultValue": "{INSERT REFERENCE CITATION HERE}",
                    "fieldLabel": "Reference",
                    "fieldName": "citation",
                    "fieldType": "java.lang.String",
                    "expectedToChange": true,
                    "required": false
                  }
                ],
                "actionName": "public_reference"
              }
            ],
            "lineValueDelimiter": ","
          },
          "description": "create substances from data in an Excel spreadsheet"
        }
      ];

      this.demoResp = {
        "adapter": "SDF Adapter",
        "adapterSettings": {
          "actions": [
            {
              "actionName": "structure_and_moieties",
              "actionParameters": {
                "molfile": "{{molfile}}",
                "referenceUUIDs": [
                  "[[UUID_1]]"
                ]
              },
              "label": "Import Structure Action",
              "fileField": "(Structure)"
            },
            {
              "fileField": "PUBCHEM_COMPOUND_CID",
              "actionName": "code_import",
              "label": "Create Code Action",
              "actionParameters": {
                "codeSystem": "PUBCHEM_COMPOUND_CID",
                "code": "{{PUBCHEM_COMPOUND_CID}}",
                "codeType": "PRIMARY",
                "codeSystemCV": "CODE_SYSTEM",
                "codeTypeCV": "CODE_TYPE"
              }
            },
            {
              "fileField": "PUBCHEM_CACTVS_HBOND_ACCEPTOR",
              "actionName": "property_import",
              "label": "Create Property Action",
              "actionParameters": {
                "name": "PUBCHEM_CACTVS_HBOND_ACCEPTOR",
                "propertyType": "chemical|physical",
                "valueRange": "{{PUBCHEM_CACTVS_HBOND_ACCEPTOR}}",
                "propertyTypeCV": "PROPERTY_TYPE",
                "valueUnits": ""
              }
            },
            {
              "fileField": "PUBCHEM_CACTVS_HBOND_DONOR",
              "actionName": "property_import",
              "label": "Create Property Action",
              "actionParameters": {
                "name": "PUBCHEM_CACTVS_HBOND_DONOR",
                "propertyType": "chemical|physical",
                "valueRange": "{{PUBCHEM_CACTVS_HBOND_DONOR}}",
                "propertyTypeCV": "PROPERTY_TYPE",
                "valueUnits": ""
              }
            },
            {
              "fileField": "PUBCHEM_CACTVS_ROTATABLE_BOND",
              "actionName": "property_import",
              "label": "Create Property Action",
              "actionParameters": {
                "name": "PUBCHEM_CACTVS_ROTATABLE_BOND",
                "propertyType": "chemical|physical",
                "valueRange": "{{PUBCHEM_CACTVS_ROTATABLE_BOND}}",
                "propertyTypeCV": "PROPERTY_TYPE",
                "valueUnits": ""
              }
            },
            {
              "fileField": "PUBCHEM_IUPAC_OPENEYE_NAME",
              "actionName": "common_name",
              "label": "Create Name Action",
              "actionParameters": {
                "name": "{{PUBCHEM_IUPAC_OPENEYE_NAME}}",
                "nameType": "cn",
                "lang": "en",
                "langCV": "LANGUAGE",
                "displayName": false,
                "nameTypeCV": "NAME_TYPE",
                "referenceUUIDs": [
                  "[[UUID_1]]"
                ]
              }
            },
            {
              "fileField": "PUBCHEM_IUPAC_CAS_NAME",
              "actionName": "common_name",
              "label": "Create Name Action",
              "actionParameters": {
                "name": "{{PUBCHEM_IUPAC_CAS_NAME}}",
                "nameType": "cn",
                "lang": "en",
                "langCV": "LANGUAGE",
                "displayName": false,
                "nameTypeCV": "NAME_TYPE",
                "referenceUUIDs": [
                  "[[UUID_1]]"
                ]
              }
            },
            {
              "fileField": "PUBCHEM_IUPAC_NAME_MARKUP",
              "actionName": "common_name",
              "label": "Create Name Action",
              "actionParameters": {
                "name": "{{PUBCHEM_IUPAC_NAME_MARKUP}}",
                "nameType": "cn",
                "lang": "en",
                "langCV": "LANGUAGE",
                "displayName": false,
                "nameTypeCV": "NAME_TYPE",
                "referenceUUIDs": [
                  "[[UUID_1]]"
                ]
              }
            },
            {
              "fileField": "PUBCHEM_IUPAC_NAME",
              "actionName": "common_name",
              "label": "Create Name Action",
              "actionParameters": {
                "name": "{{PUBCHEM_IUPAC_NAME}}",
                "nameType": "cn",
                "lang": "en",
                "langCV": "LANGUAGE",
                "displayName": false,
                "nameTypeCV": "NAME_TYPE",
                "referenceUUIDs": [
                  "[[UUID_1]]"
                ]
              }
            },
            {
              "fileField": "PUBCHEM_EXACT_MASS",
              "actionName": "code_import",
              "label": "Create Code Action",
              "actionParameters": {
                "codeSystem": "PUBCHEM_EXACT_MASS",
                "code": "{{PUBCHEM_EXACT_MASS}}",
                "codeType": "PRIMARY",
                "codeSystemCV": "CODE_SYSTEM",
                "codeTypeCV": "CODE_TYPE"
              }
            },
            {
              "fileField": "PUBCHEM_MOLECULAR_FORMULA",
              "actionName": "property_import",
              "label": "Create Property Action",
              "actionParameters": {
                "name": "PUBCHEM_MOLECULAR_FORMULA",
                "propertyType": "chemical|physical",
                "valueRange": "{{PUBCHEM_MOLECULAR_FORMULA}}",
                "propertyTypeCV": "PROPERTY_TYPE",
                "valueUnits": ""
              }
            },
            {
              "fileField": "PUBCHEM_CACTVS_TAUTO_COUNT",
              "actionName": "property_import",
              "label": "Create Property Action",
              "actionParameters": {
                "name": "PUBCHEM_CACTVS_TAUTO_COUNT",
                "propertyType": "chemical|physical",
                "valueRange": "{{PUBCHEM_CACTVS_TAUTO_COUNT}}",
                "propertyTypeCV": "PROPERTY_TYPE",
                "valueUnits": ""
              }
            },
            {
              "actionName": "public_reference",
              "actionParameters": {
                "docType": "CATALOG",
                "citation": "INSERT REFERENCE CITATION HERE",
                "referenceID": "INSERT REFERENCE ID HERE",
                "uuid": "[[UUID_1]]",
                "publicDomain": true
              },
              "label": "Create Reference"
            }
          ],
          "parameters": {
            "fileEncoding": "UTF-8",
            "adapter": "SDF Adapter",
            "entityType": "ix.ginas.models.v1.Substance"
          }
        },
        "adapterSchema": {
          "SDF Fields": [
            "cdk:Title",
            "PUBCHEM_COMPOUND_CID",
            "PUBCHEM_CACTVS_HBOND_ACCEPTOR",
            "PUBCHEM_CACTVS_HBOND_DONOR",
            "PUBCHEM_CACTVS_ROTATABLE_BOND",
            "PUBCHEM_IUPAC_OPENEYE_NAME",
            "PUBCHEM_IUPAC_CAS_NAME",
            "PUBCHEM_IUPAC_NAME_MARKUP",
            "PUBCHEM_IUPAC_NAME",
            "PUBCHEM_EXACT_MASS",
            "PUBCHEM_MOLECULAR_FORMULA",
            "PUBCHEM_CACTVS_TAUTO_COUNT"
          ],
          "fileName": "pubchem_search_clean_selected_properties_warfarin_1-100.sdf"
        },
        "payloadID": "db6c2eae-d8a0-4955-a4c8-566a871a4eca",
        "filename": "pubchem_search_clean_selected_properties_warfarin_1-100.sdf",
        "size": 319352,
        "mimeType": "application/octet-stream",
        "fileEncoding": "UTF-8",
        "entityType": "ix.ginas.models.v1.Substance",
        "id": "361371c4-9990-4621-8999-5bc44ac46f87"
      };
}

replaceAction(s: string) {
  return s && s.replace(' Action','');
}
}
