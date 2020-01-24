import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-selector */
/* tslint:disable:use-host-property-decorator */
/* tslint:disable:directive-class-suffix */
/* tslint:disable:no-input-rename */
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
