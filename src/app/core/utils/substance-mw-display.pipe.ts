import { NgModule, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'molecularWeightDisplay'
})

@NgModule({})
export class SubstanceMolecularWeightDisplay implements PipeTransform {
    
  transform(chemicalSubstance: any): string {
    var displayValue= "";
    const mwPropertyname ="MOL_WEIGHT";
    chemicalSubstance.properties.array.forEach(element => {
        if(element.name.indexOf( mwPropertyname) ===0) {
            displayValue = element.value.average != null ? element.value.average : element.value.nonNumericValue;
            displayValue += " prop";
        }
        
    });
    if( displayValue.length ===0 && chemicalSubstance.structure !==null) {
        displayValue=chemicalSubstance.mwt + 20000;
    }
     return displayValue;
  }
}
