import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facetDisplay'
})
export class FacetDisplayPipe implements PipeTransform {

  transform(name: any, args?: any): any {
    if (args) {
      if (args === 'types') {
        if (name === 'structurallyDiverse') {
          return 'Structurally Diverse';
        } else if (name === 'nucleicAcid') {
          return 'Nucleic Acid';
        } else if (name === 'specifiedSubstanceG1') {
          return 'G1 Specified Substance';
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
