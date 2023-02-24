import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../config/config.service';

@Pipe({
  name: 'facetDisplay'
})
export class FacetDisplayPipe implements PipeTransform {

  constructor(
    public configService: ConfigService
  ) { }

  transform(name: any, args?: any): any {
    console.log(name);
    //TODO: move this snippet to the constructor to be run only once
    let codeTerm = 'UNII';
    if (this.configService.configData && this.configService.configData.approvalCodeName) {
	     codeTerm = this.configService.configData.approvalCodeName;
	  }



    if (args) {
      if (args === 'types') {
        if (name === 'structurallyDiverse') {
          return 'Structurally Diverse';
        } else if (name === 'nucleicAcid') {
          return 'Nucleic Acid';
        } else if (name === 'specifiedSubstanceG1') {
          return 'Group 1 Specified Substance';
        } else if (name === 'specifiedSubstanceG3') {
          return 'Group 3 Specified Substance';
        } else {
          return name.charAt(0).toUpperCase() + name.slice(1);
        }
      } else if (args === 'status') {
        if (name === 'approved') {
          return 'Validated (' + codeTerm + ')';
        } else if (name === 'non-approved') {
          return 'non-Validated';
        }
      }
    }
    if(this.configService && this.configService.configData.facetDisplay) {
      let returned = name;
      this.configService.configData.facetDisplay.forEach(facet => {
        if (name === facet.value) {
          returned = facet.display;
          return facet.display;
        }
      });
      if (returned !== name) {
        return returned;
      }
    }
    if (name.toLowerCase() === 'substancestereochemistry') {
      return 'Stereochemistry';
    }
    if (name === 'root_lastEdited') {
      return 'Last Edited Date';
    }
    if (name === 'root_approved') {
      return 'Last Validated Date';
    }
    if (name === 'root_created') {
      return 'Created Date';
    }
    if (name === 'Approved By') {
      return 'Validated By';
    }
    if (name === 'root_lastEditedBy') {
      return 'Last Edited By';
    }
    if (name === 'Substance Class') {
      return 'Substance Type';
    }
    if (name === 'GInAS Tag') {
      return 'Source Tag';
    }

    if (name === 'GInAS Domain') {
      return 'Domain';
    }
    if (args === 'relationships') {
      if (name.indexOf('->') >= 0) {
        let temp = name.split ('->');
        if (temp[0].trim() === 'PARENT') {
          return temp[1].trim() + ' (PARENT)';
        } else {
          return temp[0].trim() + ' -> ' + temp[1].trim();
        }
      }
    }
    if (name === 'root_submitDate') {
      return 'Submit Date';
    }

    return name.trim();
  }



}
