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
  unsaved = false;
  entity = 'substances';

  private privateOptions: any;
  temp: any;
  

 scrubberSchema = {};

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    public substanceService: SubstanceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.entity) {
      this.entity = data.entity;
    }
   }

  ngOnInit() {
    this.sortConfigs();
    this.scrubberModel = { };
        this.expanderModel = {};
    this.substanceService.getSchema('scrubber', this.entity).subscribe(response => {
      
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
    this.substanceService.getSchema('expander', this.entity).subscribe(response => {
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
  this.substanceService.getExportOptions(this.data.extension, this.entity).subscribe(response => {
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
      this.unsaved = this.unsavedChangeCheck(this.loadedConfig.expanderSettings, this.privateExpanderModel)
    } else if( model === 'scrubber') {
      this.privateScrubberModel = event;
      this.unsaved = this.unsavedChangeCheck(this.loadedConfig.scrubberSettings, this.privateScrubberModel);
    } else {
      this.privateExporterModel = event;
      this.unsaved = this.unsavedChangeCheck(this.loadedConfig.exporterSettings, this.privateExporterModel);
    }
  }

  save(): void {
    let response = {
      'name': this.name,
      'id': this.loadedConfig? this.loadedConfig.configurationId : null
    };
  
    if (this.unsavedChanges()) {
              // if options are hidden and there are changes, they should have already seen the confirm
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
    
  }

  cancel(): void {
    this.dialogRef.close();
  }

  toggleShowOptions(): void {
    if (this.showOptions && this.unsavedChanges()) {
      
      if (confirm('Warning: Unsaved changes to the configuration will not be applied. Continue?')) {
        this.showOptions = !this.showOptions;
        }
    } else {
      this.showOptions = !this.showOptions;
    }
    
  }



  sortConfigs() {
    this.substanceService.getConfigs(this.entity).subscribe(response => {
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
      let found = false;
      this.privateOptions.forEach(conf => {
        if (conf.exporterKey === 'PUBLIC_DATA_ONLY') {
          found = true;
          this.switchConfig(conf, true);
          this.loadedConfig = conf;
        }
      });
      if (!found) {
        this.privateOptions.forEach(conf => {
          if (conf.exporterKey === 'ALL_DATA') {
            found = true;
            this.switchConfig(conf, true);
            this.loadedConfig = conf;
          }
        })
      }
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
    this.substanceService.storeNewConfig(test, this.entity).subscribe(response => {
      if (response.Result) {
        this.message = response.Result;
      }
      this.options.push(test);
      this.loadedConfig = test;
      if (response['Newly created configuration']) {
        this.message = 'Newly created configuration: ' + response['Newly created configuration'];
        this.loadedConfig.configurationId = response['Newly created configuration'];
        this.unsaved = false;
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
    this.substanceService.updateConfig(this.loadedConfig.configurationId, this.loadedConfig, this.entity).subscribe(response => {
      if (response.Result) {
        this.message = response.Result;
        this.unsaved = false;
      }
    })
  }

  deleteConfig(id?: string) {
    this.message = null;

    if(!id) {
      id = this.loadedConfig.configurationId;
    }
    if (confirm("Are you sure you want to delete this configuration?")) {

    this.substanceService.deleteConfig(id, this.entity).subscribe(response => {
      this.substanceService.getConfigs(this.entity).subscribe(response2 => {
        this.options = response2;
      });
      this.loadedConfig = null;
      if (response.Result) {
        this.message = response.Result;
      }
    });
  }
  }

  unsavedChangeCheck(config: any, model: any): boolean {
    // check a given saved config to the current model used by a form, return true if unsaved changes detected
    // we need to treat properties that are undefined, null, false, or empty arrays as the same value for the sake of detecting differences

    let result = false;
    if (!_.isEqual(config, model)) {
      if ((!config || Object.keys(config).length === 0) && 
      (!model || Object.keys(model).length === 0)) {
      } else {
        let check1 = (config)?JSON.parse(JSON.stringify(config)):{};
        let check2 = (model)?JSON.parse(JSON.stringify(model)):{};

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
          result = true;
        }
      }
    }
    return result;
  }

  unsavedChanges(): boolean {
    if (
      this.unsavedChangeCheck(this.loadedConfig.scrubberSettings, this.privateScrubberModel) ||
      this.unsavedChangeCheck(this.loadedConfig.exporterSettings, this.privateExporterModel) || 
      this.unsavedChangeCheck(this.loadedConfig.expanderSettings, this.privateExpanderModel)
    ) {
      return true;
    } else {
      return false;
    }
 
  }

  undo(): void {
    this.message = null;
    this.switchConfig(this.loadedConfig);
    this.message = "Reloaded saved settings for configuration '" +this.loadedConfig.exporterKey + "'";
  }

  switchConfig(event: any, preload?: boolean) {
    this.message = "";
    let testing = {};
    this.unsaved = false;
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
    if (!preload) {
      this.message = "Export Configuration " + this.configName + " Loaded";
    }
  }
}

