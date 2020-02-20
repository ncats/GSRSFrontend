import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'classDisplay'
})
export class SubstanceClassPipe implements PipeTransform {
  transform(name: string, item2?: string): string {
    const tempName = name.toLowerCase().replace(' ','');
    if (tempName === 'chemical') {
      return 'Chemical';
    } else if (tempName === 'nucleicacid') {
      return 'Nucleic Acid';
    } else if (tempName === 'protein') {
      return 'Protein';
    } else if (tempName === 'specifiedsubstanceg1') {
      return 'Group 1 Specified Substance';
    } else if (tempName === 'polymer') {
      return 'Polymer';
    } else if (tempName === 'structurallydiverse') {
      return 'Structurally Diverse';
    } else if (tempName === 'polymer') {
      return 'Polymer';
    } else if (tempName === 'concept') {
      return 'Concept';
    } else {
      return name;
    }

  }
}
