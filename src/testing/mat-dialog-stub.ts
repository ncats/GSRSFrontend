import { MatDialogRefStub } from './mat-dialog-ref-stub';

export class MatDialogStub {

    private dialogRef: MatDialogRefStub;

    open(component: any, options: any):  MatDialogRefStub {
        this.dialogRef = new MatDialogRefStub();
        return this.dialogRef;
    }

    closeDialogRef(response?: any): void {
        this.dialogRef.close(response);
    }
}
