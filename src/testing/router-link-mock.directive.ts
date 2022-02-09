import { Directive, Input } from '@angular/core';

/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable */
/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @angular-eslint/no-input-rename */
@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveMock {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}
