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
  options = [];
  loadedConfig: any;
  configName: string;
  message: string;
  privateModel: any;
  private privateOptions: any;
  temp: any;
  

 mySchema = {};

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
      this.mySchema = response;
        Object.keys(this.mySchema.properties).forEach(val => {
        //  console.log(val);
        if (response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
         //   console.log('found');
            response.properties[vis]['children'] = 1;
          }
        });
          
          
        }
        })
        
    });
    this.substanceService.getSchema('expander').subscribe(response => {
   //   console.log(response);
      this.expanderSchema = response;
      Object.keys(response.properties).forEach(val => {
     //   console.log(response.properties[val]);
        if (response.properties[val]['visibleIf']) {
          Object.keys(response.properties[val]['visibleIf']).forEach(vis => {
          if (response.properties[vis]) {
         //   console.log('found');
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
    //  console.log('using extension: ' + this.data.extension);
  }


  setValue(event: any, model?: string ): void {
    console.log('triggered');
    console.log(event);
    console.log(this.temp);
    if (model && model === 'expander') {
     // console.log(event);
      this.expanderModel = event;
    } else {
    //  this.scrubberModel = event;
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
    console.log(this.expanderModel);
    this.message = null;
    const test = {"exporterKey":this.configName,
    "scrubberSettings": this.scrubberModel,
    "expanderSettings": this.expanderModel,
    "exporterSettings":null};
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
    console.log(this.expanderModel);
    this.loadedConfig.scrubberSettings = this.scrubberModel;
    this.loadedConfig.expanderSettings = this.expanderModel;
    console.log(this.loadedConfig);
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
    console.log(event);
    this.scrubberModel = null;
    this.expanderModel = null;
    this.scrubberModel = {};
    this.expanderModel = {};
    Object.keys(this.scrubberModel).forEach(val => {
      delete this.scrubberModel[val];
    });
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

