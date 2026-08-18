import { ReplaySubject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { Routes } from '@angular/router';
import { vi } from 'vitest';

export class RouterStub {
    private subject = new ReplaySubject<NavigationEnd>();
    readonly routerState: any;
    readonly events = this.subject.asObservable();
    routeReuseStrategy: any = { shouldReuseRoute: () => false };

    constructor() {
        this.routerState = {
            snapshot: {
                url: ''
            }
        };
    }

    navigate = vi.fn().mockReturnValue(new Promise((resolve, reject) => {
    }));

    createUrlTree = vi.fn();

    serializeUrl = vi.fn();

    fireNavigationEndEvent(url: string): void {
        const navigationEnd = new NavigationEnd(0, url, '');
        this.subject.next(navigationEnd);
    }

    setSnapshotUrl(url: string): void {
        this.routerState.snapshot.url = url;
    }

}
