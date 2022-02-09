import { ComponentRef, Output, EventEmitter, Injectable } from '@angular/core';
import { SubstanceFormBase } from './base-classes/substance-form-base';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { MatExpansionPanel } from '@angular/material/expansion';

@Injectable()
export class SubstanceFormSection {
    dynamicComponentName: string;
    dynamicComponentRef: ComponentRef<SubstanceFormBase | SubstanceCardBaseFilteredList<any> | any>;
    matExpansionPanel:  MatExpansionPanel;
    menuLabel: string;
    isHidden = false;
    canAddItem = false;
    @Output() addItemEmitter = new EventEmitter();

    constructor(dynamicComponentName?: string) {
        this.dynamicComponentName = dynamicComponentName;
    }

    addItem(): void {
        this.addItemEmitter.emit();
    }
}
