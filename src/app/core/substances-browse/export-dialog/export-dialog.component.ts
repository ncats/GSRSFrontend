import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
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
  

 scrubberSchema = {};

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
      
        Object.keys(response.properties).forEach(val => {
        if (response.properties[val] && response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
            response.properties[vis]['children'] = 1;
          }
        });
          
          
        }
        })
        this.scrubberSchema = response;
        
    });
    this.substanceService.getSchema('expander').subscribe(response => {
      Object.keys(response.properties).forEach(val => {
        if (response.properties[val] && response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
            response.properties[vis]['children'] = 1;
          }
        });
          
          
        }
      });
      this.expanderSchema = response;

  });
  this.substanceService.getExportOptions(this.data.extension).subscribe(response => {
    Object.keys(response.properties).forEach(val => {
      if (response.properties[val] && response.properties[val]['visibleIf']) {
        Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
        if (response.properties[vis]) {
          response.properties[vis]['children'] = 1;
        }
      });
        
        
      }
    });
    this.exporterSchema = response;

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
  

    if (!this.unsavedChanges) {
      if(this.showOptions) {
        if (confirm('Warning: Unsaved changes to the configuration will not be applied. Continue?')) {
          this.dialogRef.close(response);
        }
      } else {
        this.dialogRef.close(response);
      }
      
    } else {
      this.dialogRef.close(response);
    }
   // this.dialogRef.close(response);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  toggleShowOptions(): void {
    if (this.showOptions && !this.unsavedChanges()) {
      
      if (confirm('Warning: Unsaved changes to the configuration will not be applied. Continue?')) {
        this.showOptions = !this.showOptions;
        }
    } else {
      this.showOptions = !this.showOptions;
    }
    
  }

  test2(): void {
    let response = {
      'name': this.name,
    };
   // this.dialogRef.close(response);
  }


  testing() {
    this.substanceService.getConfigs().subscribe(response => {
      this.options = response;
      this.privateOptions = response.sort((a, b) => {

        let test = -1;
        if (a.exporterKey === 'PUBLIC_DATA_ONLY') {
          test = -1;
          
        }
          else if (b.exporterKey === 'PUBLIC_DATA_ONLY') {
            test = 1;
        }else {
          test = 1;
        }
        return test;
      });
      this.privateOptions.forEach(conf => {
        if (conf.exporterKey === 'PUBLIC_DATA_ONLY') {
          this.switchConfig(conf);
          this.loadedConfig = conf;
        }
      })
    });
  }

  saveConfig() {
    this.message = null;
    let found = false;
    const test = {"exporterKey":this.configName,
    "scrubberSettings": this.privateScrubberModel,
    "expanderSettings": this.privateExpanderModel,
    "exporterSettings": this.privateExporterModel};
    this.privateOptions.forEach(conf => {
      if (conf.exporterKey === this.configName) {
        found = true;
      }
    });
    if (!found){
    this.substanceService.storeNewConfig(test).subscribe(response => {
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
  } else {
    alert('Cannot Save: config name "' + this.configName + "' already exists");
  }
  }

  updateConfig() {
    this.message = null;

    this.loadedConfig.scrubberSettings = this.privateScrubberModel;
    this.loadedConfig.expanderSettings = this.privateExpanderModel;
    this.loadedConfig.exporterSettings = this.privateExporterModel;

    this.substanceService.updateConfig(this.loadedConfig.configurationId, this.loadedConfig).subscribe(response => {
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
    if (confirm("Are you sure you want to delete this configuration?")) {

    this.substanceService.deleteConfig(id).subscribe(response => {
      this.substanceService.getConfigs().subscribe(response2 => {
        this.options = response2;
      });
      this.loadedConfig = null;
      if (response.Result) {
        this.message = response.Result;
      }
    });
  }
  }

  unsavedChanges(): boolean {
    // we need to treat properties that are undefined, null, false, or empty arrays as the same value for the sake of detecting differences
    let result = true;
    if (!_.isEqual(this.loadedConfig.scrubberSettings, this.privateScrubberModel)) {
      if ((!this.loadedConfig.scrubberSettings || Object.keys(this.loadedConfig.scrubberSettings).length === 0) && 
      (!this.privateScrubberModel || Object.keys(this.privateScrubberModel).length === 0)) {
      } else {
        let check1 = (this.loadedConfig.scrubberSettings)?JSON.parse(JSON.stringify(this.loadedConfig.scrubberSettings)):{};
        let check2 = (this.privateScrubberModel)?JSON.parse(JSON.stringify(this.privateScrubberModel)):{};

        Object.keys(check1).forEach(key => {
          if (!check1[key] || check1[key].length === 0) {
            delete check1[key];
          }
        });
        Object.keys(check2).forEach(key => {
          if (!check2[key] || check2[key].length === 0) {
            delete check2[key];
          }
        });
        if (!_.isEqual(check1, check2)) {
          result = false;
        }
      }
    }

    if (!_.isEqual(this.loadedConfig.exporterSettings, this.privateExporterModel)) {
      if ((!this.loadedConfig.exporterSettings || Object.keys(this.loadedConfig.exporterSettings).length === 0) && 
      (!this.privateExporterModel || Object.keys(this.privateExporterModel).length === 0)) {
      } else {
        let check1 = (this.loadedConfig.exporterSettings)?JSON.parse(JSON.stringify(this.loadedConfig.exporterSettings)):{};
        let check2 = (this.privateExporterModel)?JSON.parse(JSON.stringify(this.privateExporterModel)):{};

        Object.keys(check1).forEach(key => {
          if (!check1[key] || check1[key].length === 0) {
            delete check1[key];
          }
        });
        Object.keys(check2).forEach(key => {
          if (!check2[key] || check2[key].length === 0) {
            delete check2[key];
          }
        });
        if (!_.isEqual(check1, check2)) {
          result = false;
        }
      }
    }

    if (!_.isEqual(this.loadedConfig.expanderSettings, this.privateExpanderModel)) {
      if ((!this.loadedConfig.expanderSettings || Object.keys(this.loadedConfig.expanderSettings).length === 0) && 
      (!this.privateExpanderModel || Object.keys(this.privateExpanderModel).length === 0)) {
      } else {
        let check1 = (this.loadedConfig.expanderSettings)?JSON.parse(JSON.stringify(this.loadedConfig.expanderSettings)):{};
        let check2 = (this.privateExpanderModel)?JSON.parse(JSON.stringify(this.privateExpanderModel)):{};

        Object.keys(check1).forEach(key => {
          if (!check1[key] || check1[key].length === 0) {
            delete check1[key];
          }
        });
        Object.keys(check2).forEach(key => {
          if (!check2[key] || check2[key].length === 0) {
            delete check2[key];
          }
        });
        if (!_.isEqual(check1, check2)) {
          result = false;
        }
      }
    }

    return result;


    

  }

  switchConfig(event: any) {
 
    let testing = {};
    this.privateOptions.forEach(opt =>{
      if (opt.configurationId === event.configurationId) {

        // added check if the settings are truthy. Sometimes they may be null or undefined. If ther are, set to empty object
        // to avoid null/undefined reference calls
        this.expanderModel = (opt.expanderSettings)?JSON.parse(JSON.stringify(opt.expanderSettings)):{};
        this.scrubberModel = (opt.scrubberSettings)?JSON.parse(JSON.stringify(opt.scrubberSettings)):{};
        this.exporterModel = (opt.exporterSettings)?JSON.parse(JSON.stringify(opt.exporterSettings)):{};
        this.privateExpanderModel = (opt.expanderSettings)?JSON.parse(JSON.stringify(opt.expanderSettings)):{};
        this.privateScrubberModel = (opt.scrubberSettings)?JSON.parse(JSON.stringify(opt.scrubberSettings)):{};
        this.privateExporterModel = (opt.exporterSettings)?JSON.parse(JSON.stringify(opt.exporterSettings)):{};

        testing = opt.scrubberSettings;
        this.temp = opt.scrubberSettings;
     /*   Object.keys(opt.scrubberSettings).forEach(val => {
          this.scrubberModel[val] = opt.scrubberSettings[val];
        });*/
      }
    })
    this.configName = event.exporterKey;
    setTimeout(()=> {
      this.scrubberModel = testing;
    }, 100);
  }
}

