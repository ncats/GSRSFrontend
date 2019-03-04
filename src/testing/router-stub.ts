import { ReplaySubject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { Routes } from '@angular/router';

export class RouterStub {
    private subject = new ReplaySubject<NavigationEnd>();
    readonly routerState: any;
    readonly events = this.subject.asObservable();

    constructor() {
        this.routerState = {
            snapshot: {
                url: ''
            }
        };
    }

    navigate = jasmine.createSpy('navigate').and.returnValue(new Promise((resolve, reject) => {
    }));

    createUrlTree = jasmine.createSpy('createUrlTree');

    serializeUrl = jasmine.createSpy('serializeUrl');

    fireNavigationEndEvent(url: string): void {
        const navigationEnd = new NavigationEnd(0, url, '');
        this.subject.next(navigationEnd);
    }

    setSnapshotUrl(url: string): void {
        this.routerState.snapshot.url = url;
    }

}
