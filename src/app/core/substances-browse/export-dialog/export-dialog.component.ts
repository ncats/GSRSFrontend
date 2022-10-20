import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubstanceService } from '@gsrs-core/substance/substance.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {
  name: string;
  extension: string;
  showOptions = false;
  scrubberModel = {};
  expanderModel = {};
  expanderSchema: any;
  exporterModel = {};
  exporterSchema: any;
  options = [];
  loadedConfig: any;
  configName: string;
  message: string;
  privateExpanderModel: any;
  privateScrubberModel: any;
  privateExporterModel: any;

  private privateOptions: any;
  temp: any;
  

 scrubberSchema: any;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    public substanceService: SubstanceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.testing();
    this.scrubberModel = { };
        this.expanderModel = {};
    this.substanceService.getSchema('scrubber').subscribe(response => {
      
        console.log(response);
      this.scrubberSchema = response;
    console.log(this.scrubberSchema);
        Object.keys(this.scrubberSchema.properties).forEach(val => {
        //  console.log(val);
        console.log(val);
        if (response.properties[val] && response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
            response.properties[vis]['children'] = 1;
          }
        });
          
          
        }
        })
        
    });
    this.substanceService.getSchema('expander').subscribe(response => {
      this.expanderSchema = response;
      console.log(response);
      Object.keys(response.properties).forEach(val => {
        if (response.properties[val] && response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
            response.properties[vis]['children'] = 1;
          }
        });
          
          
        }
      })
  });
  this.substanceService.getExportOptions(this.data.extension).subscribe(response => {
    console.log(response);
    this.exporterSchema = response;
    Object.keys(response.properties).forEach(val => {
      if (response.properties[val] && response.properties[val]['visibleIf']) {
        Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
        if (response.properties[vis]) {
          response.properties[vis]['children'] = 1;
        }
      });
        
        
      }
    })
});
    const date = new Date();
    if (this.data.type && this.data.type !== null && this.data.type !== '') {
      this.name = this.data.type + '-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    } else {
      this.name = 'export-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    }
      this.extension = this.data.extension;
  }


  setValue(event: any, model?: string ): void {
    if (model && model === 'expander') {
      this.privateExpanderModel = event;
    } else if( model === 'scrubber') {
      this.privateScrubberModel = event;
    } else {
      this.privateExporterModel = event;
    }
  }

  save(): void {
    let response = {
      'name': this.name,
      'id': this.loadedConfig? this.loadedConfig.configurationId : null
    };
    this.dialogRef.close(response);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  test2(): void {
    let response = {
      'name': this.name,
    };
    this.dialogRef.close(response);
  }


  testing() {
    this.substanceService.getConfigs().subscribe(response => {
      this.options = response;
      console.log(response);
      this.privateOptions = response;
    });
  }

  saveConfig() {
    console.log(this.scrubberModel);
    console.log(this.privateScrubberModel);
    this.message = null;
    const test = {"exporterKey":this.configName,
    "scrubberSettings": this.privateScrubberModel,
    "expanderSettings": this.privateExpanderModel,
    "exporterSettings": this.privateExporterModel};
    this.substanceService.storeNewConfig(test).subscribe(response => {
      console.log(response);
      if (response.Result) {
        this.message = response.Result;
      }
      this.options.push(test);
      this.loadedConfig = test;
      if (response['Newly created configuration']) {
        this.message = 'Newly created configuration: ' + response['Newly created configuration'];
        this.loadedConfig.configurationId = response['Newly created configuration'];

      }
    });
  }

  updateConfig() {
    this.message = null;

    console.log(this.scrubberModel);
    console.log(this.privateScrubberModel);
    this.loadedConfig.scrubberSettings = this.privateScrubberModel;
    this.loadedConfig.expanderSettings = this.privateExpanderModel;
    this.loadedConfig.exporterSettings = this.privateExpanderModel;

    this.substanceService.updateConfig(this.loadedConfig.configurationId, this.loadedConfig).subscribe(response => {
      console.log(response);
      if (response.Result) {
        this.message = response.Result;
      }
    })
  }

  deleteConfig(id?: string) {
    this.message = null;

    if(!id) {
      id = this.loadedConfig.configurationId;
    }
    this.substanceService.deleteConfig(id).subscribe(response => {
      this.substanceService.getConfigs().subscribe(response2 => {
        console.log(response2);
        this.options = response2;
      });
      this.loadedConfig = null;
      console.log(response);
      if (response.Result) {
        this.message = response.Result;
      }
    });
  }

  switchConfig(event: any) {
 /*   console.log(event);
    this.scrubberModel = null;
    this.expanderModel = null;
    this.scrubberModel = {};
    this.expanderModel = {};
    Object.keys(this.scrubberModel).forEach(val => {
      delete this.scrubberModel[val];
    });*/
    if (event.scrubberSettings) {
    //  this.scrubberModel = event.scrubberSettings;
    }
    if (event.expanderSettings) {
    //  this.expanderModel = event.expanderSettings;
    }
    let testing = {};
    this.privateOptions.forEach(opt =>{
      if (opt.configurationId === event.configurationId) {
        console.log('found');
        console.log(opt);
        this.expanderModel = JSON.parse(JSON.stringify(opt.expanderSettings));
        this.scrubberModel = JSON.parse(JSON.stringify(opt.scrubberSettings));
        this.exporterModel = JSON.parse(JSON.stringify(opt.exporterSettings));

        testing = opt.scrubberSettings;
        this.temp = opt.scrubberSettings;
        Object.keys(opt.scrubberSettings).forEach(val => {
          this.scrubberModel[val] = opt.scrubberSettings[val];
        });
      }
    })
    this.configName = event.exporterKey;
    setTimeout(()=> {
      console.log(this.scrubberModel);
      this.scrubberModel = testing;
    }, 100);
  }
}

