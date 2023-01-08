import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadObject } from '@gsrs-core/admin/admin-objects.model';
import { LoadingService } from '@gsrs-core/loading';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';


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

constructor(
  public formBuilder: FormBuilder,
  public adminService: AdminService,
  private router: Router,
  private route: ActivatedRoute,
  private loadingService: LoadingService,
  private overlayContainerService: OverlayContainer,
  private dialog: MatDialog,
  


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
    this.settingsActive = this.adapterSettings.fileImportActions[index];
    console.log('template opened for adapter of index ' + index);
    console.log(this.settingsActive.fields);

    const dialogRef = this.dialog.open(templateRef, {
      height: '400px',
      width: '800px',
      data: {
        active: this.settingsActive
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
      this.adapterSettings.fileImportActions[index] = this.settingsActive;
      console.log('new adapter settings set:');
      console.log(this.adapterSettings.fileImportActions[index]);
    });
}

ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();


  this.uploadForm = this.formBuilder.group({
    file: [''],
    fileType: ['JSON'],
    audit: [false]
  });
  this.fileType = 'JSON';

  this.adminService.getAdapters().subscribe(result => {
      console.log('successfully fetched adapters');
      console.log(result);
      this.demo = result;

  }, error => {
      alert('failed to fetch adapters, using demo vals. error in console');
      console.log(error);
    this.setDemo();
  });
  


}

openModal(templateRef, current) {

    const dialogRef = this.dialog.open(templateRef, {
      height: '200px',
      width: '400px',
      data: {
        active: current
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

onSubmit() {
  const formData = new FormData();
  this.loadingService.setLoading(true);

  formData.append('file-name', this.uploadForm.get('file').value);
   formData.append('file-type', this.fileType);

  this.adminService.postAdapterFile(formData, ).pipe(take(1)).subscribe(response => {
    this.loadingService.setLoading(false);
    this.step = 3;

   // this.router.navigate(['/monitor/' + response.id]);
 }, error => {
  this.message = 'File could not be uploaded';
  console.log(error);
  alert('issue with the upload call, continuing with non-api demo. Error in console');
  this.step = 3;
  this.loadingService.setLoading(false);
 });
}

onFileSelect(event): void {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.filename = file.name;
    this.uploadForm.get('file').setValue(file);
   // this.step = 2;

  }
}

openInput(): void {
  document.getElementById('fileInput').click();
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
}
}
