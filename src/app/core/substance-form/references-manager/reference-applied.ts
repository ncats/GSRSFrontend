import { FormControl } from '@angular/forms';
import { SubstanceReference, SubstanceDetail } from '../../substance/substance.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject, Observable } from 'rxjs';

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
    applyOptions: Array<{
        property: string;
        options: Array<{
            item: any;
            display: string;
            control: FormControl;
        }>;
    }> = [];
    private substanceUpdatedSubject = new Subject<SubstanceDetail>();

    constructor(private referenceUuid: string, private substance: SubstanceDetail) {
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
                        control: new FormControl(propertyItem.references.indexOf(referenceUuid) > -1)
                    };

                    applicationOption.options.push(option);
                });

                this.applyOptions.push(applicationOption);
            }
        });
    }

    private getObjectValue(obj: any, path: string, defaultValue: any = null): any {
        return String.prototype.split.call(path, /[,[\].]+?/)
            .filter(Boolean)
            .reduce((a: any, c: string) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue), obj);
    }

    substanceUpdated(): Observable<SubstanceDetail> {
        return this.substanceUpdatedSubject.asObservable();
    }

    updateAppliedOtion(event: MatCheckboxChange, item: any | { references: Array<string> }): any {
        if (event.checked) {
            item.references.push(this.referenceUuid);
        } else {
            const itemReferenceUuidIndex = item.references.indexOf(this.referenceUuid);

            if (itemReferenceUuidIndex > -1) {
                item.references.splice(itemReferenceUuidIndex, 1);
            }
        }
        this.substanceUpdatedSubject.next(this.substance);
    }
}
