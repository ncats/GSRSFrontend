import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '@gsrs-core/config';

@Pipe({
  name: 'facetDisplay'
})
export class FacetDisplayPipe implements PipeTransform {
  constructor(public configService: ConfigService) {

  }

  transform(name: any, args?: any): any {
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
          return 'Validated (UNII)';
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
      return 'Last Edited';
    }
    if (name === 'root_approved') {
      return 'Last Validated';
    }
    if (name === 'root_approved') {
      return 'Last Validated';
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
  
    return name.trim();
  }

}
