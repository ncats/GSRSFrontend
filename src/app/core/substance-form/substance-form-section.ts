import { ComponentRef } from '@angular/core';

export class SubstanceFormSection {
    dynamicComponentName: string;
    dynamicComponentRef: ComponentRef<any>;
    menuLabel: string;
    isHidden = false;

    constructor(dynamicComponentName?: string) {
        this.dynamicComponentName = dynamicComponentName;
    }
}
