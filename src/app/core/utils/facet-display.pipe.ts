import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facetDisplay'
})
export class FacetDisplayPipe implements PipeTransform {

  transform(name: any, args?: any): any {
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
