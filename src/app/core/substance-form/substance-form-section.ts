import { ComponentRef } from '@angular/core';

export class SubstanceFormSection {
    dynamicComponentName: string;
    dynamicComponentRef: ComponentRef<any>;
    menuLabel: string;

    constructor(dynamicComponentName?: string) {
        this.dynamicComponentName = dynamicComponentName;
    }

    updateMenuLable(label: string): void {
        this.menuLabel = label;
    }
}
