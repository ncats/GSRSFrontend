import { FormControl } from '@angular/forms';
import { SubstanceReference, SubstanceDetail } from '../../substance/substance.model';

export class ReferenceApplied {
    private propertiesWithReferences = [
        'names',
        'codes',
        'relationships',
        'notes',
        'properties'
    ];
    private displayProperties = {
        names: 'name',
        codes: 'code',
        relationships: 'relatedSubstance.name',
        notes: 'note',
        properties: 'name'
    };
    applicationOptions: Array<{
        property: string;
        options: Array<{
            item: any;
            display: string;
            control: FormControl;
        }>;
    }> = [];

    constructor(referenceUuid: string, private substance: SubstanceDetail) {
        this.propertiesWithReferences.forEach(property => {
            if (this.substance[property] && this.substance[property].length) {

                const applicationOption = {
                    property: property,
                    options: []
                };

                this.substance[property].forEach((propertyItem: any) => {

                    const option = {
                        item: propertyItem,
                        display: this.getObjectValue(propertyItem, this.displayProperties[property]),
                        constro: new FormControl(propertyItem.references.indexOf(referenceUuid) > -1)
                    };

                    applicationOption.options.push(option);
                });

                this.applicationOptions.push(applicationOption);
            }
        });
    }

    private getObjectValue(obj: any, path: string, defaultValue: any = null): any {
        return String.prototype.split.call(path, /[,[\].]+?/)
          .filter(Boolean)
          .reduce((a: any, c: string) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue), obj);
      }
}
