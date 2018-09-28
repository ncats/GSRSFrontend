import { ReplaySubject } from 'rxjs';
import { NavigationEnd, RouterState } from '@angular/router';

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

    navigate(commands: any[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
        });
    }

    fireNavigationEndEvent(url: string): void {
        const navigationEnd = new NavigationEnd(0, url, '');
        this.subject.next(navigationEnd);
    }

    setSnapshotUrl(url: string): void {
        this.routerState.snapshot.url = url;
    }

}
