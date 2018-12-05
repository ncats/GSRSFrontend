import { Observable, Observer } from 'rxjs';

export class MatDialogRefStub {

    private activeObserver?: Observer<any>;

    close(response?: any) {
        if (this.activeObserver != null) {
            this.activeObserver.next(response);
            this.activeObserver.complete();
        }
    }

    afterClosed(): Observable<any> {
        return new Observable(observer => {
            this.activeObserver = observer;
        });
    }
}
