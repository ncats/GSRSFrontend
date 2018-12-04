import { MatDialogRefStub } from './mat-dialog-ref-stub';

export class MatDialogStub {
    open():  MatDialogRefStub {
        return new MatDialogRefStub();
    }
}
