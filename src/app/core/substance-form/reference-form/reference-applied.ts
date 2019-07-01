import { FormControl } from '@angular/forms';
import { SubstanceDetail } from '../../substance/substance.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject, Observable } from 'rxjs';
import { referencesDomains, displayKeys } from '../domain-references/domains.constant';
import { DomainReferences } from '../domain-references/domain-references';
import { SubstanceFormService } from '../substance-form.service';

export class ReferenceApplied {
    private propertiesWithReferences = referencesDomains.slice();
    private displayKeys = displayKeys;
    optionCategories: Array<{
        property: string;
        options: Array<{
            item: DomainReferences;
            display: string;
            control: FormControl;
        }>;
    }> = [];
    options: Array<{
        item: DomainReferences;
        display: string;
        control: FormControl;
    }> = [];
    private substanceUpdatedSubject = new Subject<SubstanceDetail>();
    private subClass: string;

    constructor(private referenceUuid: string, private substanceFormService: SubstanceFormService) {

        substanceFormService.ready().subscribe(() => {

            this.subClass = substanceFormService.getSubstanceValue('substanceClass');

            if (this.subClass === 'chemical') {
                this.subClass = 'structure';
            } else if (this.subClass === 'specifiedSubstanceG1') {
                this.subClass = 'specifiedSubstance';
            }

            this.propertiesWithReferences.push(this.subClass);
            this.displayKeys[this.subClass] = 'definition';

            this.propertiesWithReferences.forEach(property => {
                const substanceValue = substanceFormService.getSubstanceValue(property);
                if (substanceValue) {

                    if (Object.prototype.toString.call(substanceValue) === '[object Array]' && substanceValue.length) {

                        const applicationOption = {
                            property: property,
                            options: []
                        };

                        substanceValue.forEach((propertyItem: any) => {

                            const option = {
                                item: substanceFormService.getDomainReferences(propertyItem.uuid),
                                display: this.getObjectValue(propertyItem, this.displayKeys[property]),
                                control: new FormControl(propertyItem.references.indexOf(referenceUuid) > -1)
                            };

                            applicationOption.options.push(option);
                        });

                        this.optionCategories.push(applicationOption);
                    } else if (Object.prototype.toString.call(substanceValue) === '[object Object]') {
                        const option = {
                            item: substanceFormService.getDomainReferences(substanceValue.uuid),
                            display: property,
                            control: new FormControl(substanceValue.references.indexOf(referenceUuid) > -1)
                        };

                        this.options.push(option);
                    }
                }
            });
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

    updateAppliedOtion(event: MatCheckboxChange, item: DomainReferences): any {
        if (event.checked) {
            item.addDomainReference(this.referenceUuid);
        } else {
            item.removeDomainReference(this.referenceUuid);
        }
    }

    applyToAll(): void {
        this.options.forEach(option => {
            option.item.addDomainReference(this.referenceUuid);
            option.control.setValue(true);
        });
        this.optionCategories.forEach(category => {
            category.options.forEach(option => {
                option.item.addDomainReference(this.referenceUuid);
                option.control.setValue(true);
            });
        });
    }
}
