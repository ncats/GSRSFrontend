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
  

 scrubberSchema = {
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	"$id": "https://gsrs.ncats.nih.gov/#/export.scrubber.schema.json",
	"title": "JSON Schema Settings",
	"description": "This is a debugging form",
	"type": "object",
	"properties": {

		"option1CheckboxOnly": {
			"title": "Option 1 Checkbox Only",
			"comments": "comment about option 1 checkbox",
			"type": "boolean"
    },
    "removeAllLocked1": {
      "comments": "When true, remove any data element that is marked as non-public",
      "title": "Remove all Locked",
      "type": "boolean"
    },
		"option2StringTextbox": {
			"title": "Option 2 String textbox only",
			"comments": "comment about Option 2 String textbox only",
      "type": "string",
      "visibleIf": {
        "removeAllLocked1": [
          true
        ]}
    },
    "removeAllLocked2": {
      "comments": "When true, remove any data element that is marked as non-public",
      "title": "Remove all Locked",
      "type": "boolean"
    },
		"option3StringTextbox": {
			"title": "Option 3 String text AREA only",
			"comments": "comment about Option 3 String text AREA only",
			"type": "string",
			"widget": {
				"id": "textarea"
      },
      "visibleIf": {
        "removeAllLocked2": [
          true
        ]}
		},
		"option4SingleSelectHardCoded": {
			"title": "Option 4 single-select dropdown, hard-coded list",
			"comments": "comment about Option 4 single-select dropdown, hard-coded list",
			"type": "string",
			"widget": {
				"id": "select"
			},
			"enum": [
				"option 1",
				"option 2",
				"option 3",
				"option 4"
			]
		},
		"option5SingleSelectCV": {
			"title": "Option 5 single-select dropdown, CV list",
			"comments": "comment about Option 5 single-select dropdown, CV list",
			"type": "string",
			"widget": {
				"id": "select"
			},
			"CVDomain": "ACCESS_GROUP"
    },
    
		"option6MultiSelectHardCoded": {
			"title": "Option 6 multi-select dropdown, hard-coded list",
			"comments": "comment about Option 6 multi-select dropdown, hard-coded list",
			"type": "array",
			"items": {
				"type": "string",
				"enum": [
					"option 1",
					"option 2",
					"option 3",
					"option 4"
				]
			},
			"widget": {
				"id": "multi-select"
			}
    },
    "removeAllLocked3": {
      "comments": "When true, remove any data element that is marked as non-public",
      "title": "Remove all Locked",
      "type": "boolean"
    },
		"option7MultiSelectCV": {
			"title": "Option 7 multi-select dropdown, CV list",
			"comments": "comment about Option 7 multi-select dropdown, CV list",
			"type": "array",
			"items": {
				"type": "string"
			},
			"widget": {
				"id": "multi-select"
			},
      "CVDomain": "ACCESS_GROUP",
      "visibleIf": {
        "removeAllLocked3": [
          true
        ]}
		},
		"option8SingleSelectRadioHardCoded": {
			"title": "Option 8 single-select radio, hard-coded list",
			"comments": "comment about Option 8 single-select radio, hard-coded list",
			"type": "string",
			"enum": [
				"option 1",
				"option 2",
				"option 3",
				"option 4"
			],
			"widget": {
				"id": "radio"
			}
    },
    "removeAllLocked4": {
      "comments": "When true, remove any data element that is marked as non-public",
      "title": "Remove all Locked",
      "type": "boolean"
    },
		"option9SingleSelectRadioCV": {
			"title": "Option 9 single-select radio, CV list",
			"comments": "comment about Option 9 single-select radio, CV list",
			"widget": {
				"id": "radio"
      },
      "type": "string",

      "CVDomain": "ACCESS_GROUP",
      "visibleIf": {
        "removeAllLocked4": [
          true
        ]}
		},
		"option10MultiSelectCheckboxHardCoded": {
			"title": "Option 10 multi-select checkbox, hard-coded list",
			"comments": "comment about Option 10 multi-select checkbox, hard-coded list",
			"type": "array",
			"items": {
				"type": "string",
				"enum": [
					"option 1",
					"option 2",
					"option 3",
					"option 4"
				]
			},
			"widget": {
				"id": "checkbox"
			}
    },
    "removeAllLocked5": {
      "comments": "When true, remove any data element that is marked as non-public",
      "title": "Remove all Locked",
      "type": "boolean"
    },
		"option11MultiSelectCheckboxCV": {
			"title": "Option 11 multi-select checkbox, CV list",
			"comments": "comment about Option 11 multi-select checkbox, CV list",
			"type": "array",
			"items": {
				"type": "string"
			},
			"widget": {
				"id": "checkbox"
			},
      "CVDomain": "ACCESS_GROUP",
      "visibleIf": {
        "removeAllLocked5": [
          true
        ]}
		}
	}
};

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
    //  this.scrubberSchema = response;
    console.log(this.scrubberSchema);
        Object.keys(this.scrubberSchema.properties).forEach(val => {
        //  console.log(val);
        console.log(val);
        if (this.scrubberSchema.properties[val] && this.scrubberSchema.properties[val]['visibleIf']) {
          Object.keys(this.scrubberSchema.properties[val]['visibleIf']).forEach(vis => {
          if (this.scrubberSchema.properties[vis]) {
            this.scrubberSchema.properties[vis]['children'] = 1;
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
    console.log(response);
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
    console.log(event);
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

      this.privateOptions.forEach(conf => {
        if (conf.exporterKey === 'PUBLIC_DATA_ONLY') {
          this.switchConfig(conf);
          this.loadedConfig = conf;
        }
      })
    });
  }

  saveConfig() {
    console.log(this.scrubberModel);
    console.log(this.privateScrubberModel);
    this.message = null;
    let found = false;
    const test = {"exporterKey":this.configName,
    "scrubberSettings": this.privateScrubberModel,
    "expanderSettings": this.privateExpanderModel,
    "exporterSettings": this.privateExporterModel};
    this.privateOptions.forEach(conf => {
      if (conf.exporterKey === this.configName) {
        alert('Cannot Save: config name "' + this.configName + "' already exists");
        found = true;
      }
    })
    if (!found){
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
  }

  updateConfig() {
    this.message = null;

    console.log(this.scrubberModel);
    console.log(this.privateScrubberModel);
    this.loadedConfig.scrubberSettings = this.privateScrubberModel;
    this.loadedConfig.expanderSettings = this.privateExpanderModel;
    this.loadedConfig.exporterSettings = this.privateExporterModel;

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

