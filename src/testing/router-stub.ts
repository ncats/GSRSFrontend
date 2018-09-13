import { ReplaySubject } from 'rxjs';
import { NavigationEnd, RouterState } from '@angular/router';

export class RouterStub {
    private subject = new ReplaySubject<NavigationEnd>();
    readonly routerState: any;

    constructor() {
        this.routerState = {
            snapshot: {
                url: ''
            }
        }
    }

    readonly events = this.subject.asObservable();

}