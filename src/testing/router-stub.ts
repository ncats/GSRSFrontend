import { ReplaySubject } from 'rxjs';
import { Event as RouterEvent, NavigationEnd, ResolveEnd } from '@angular/router';
import { Routes } from '@angular/router';
import { vi } from 'vitest';

export class RouterStub {
    private subject = new ReplaySubject<RouterEvent>();
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

    fireResolveEndEvent(url: string): void {
        const resolveEnd = new ResolveEnd(0, url, url, {} as any);
        this.subject.next(resolveEnd);
    }

    setSnapshotUrl(url: string): void {
        this.routerState.snapshot.url = url;
    }

}
