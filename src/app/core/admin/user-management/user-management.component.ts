import { Component, OnInit } from '@angular/core';
import { User, Auth } from '@gsrs-core/auth';
import { MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserEditDialogComponent } from '@gsrs-core/admin/user-management/user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  test: any;
  private overlayContainer: HTMLElement;
  displayedColumns: string[] = ["name", 'active', 'email', 'created', 'modified'];
users: Array<Auth> = [{"id":35,"version":5,"namespace":null,"created":1588192887724,"modified":1588193156359,"deprecated":false,"user":{"id":34,"version":2,"namespace":null,"created":1588191987797,"modified":1588193156341,"deprecated":false,"provider":null,"username":"test","email":"test@test.test","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null},"active":true,"systemAuth":false,"key":"Bvm2IpJZldJvAfPS3UCW","properties":[],"groups":[{"name":"testGroup","id":34,"members":[{"id":1,"version":1,"namespace":null,"created":1588101953023,"modified":1588101953066,"deprecated":false,"provider":null,"username":"admin","email":"","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null},{"id":34,"version":2,"namespace":null,"created":1588191987797,"modified":1588193156341,"deprecated":false,"provider":null,"username":"test","email":"test@test.test","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null}],"_matchContext":null},{"name":"admin","id":33,"members":[{"id":1,"version":1,"namespace":null,"created":1588101953023,"modified":1588101953066,"deprecated":false,"provider":null,"username":"admin","email":"","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null},{"id":34,"version":2,"namespace":null,"created":1588191987797,"modified":1588193156341,"deprecated":false,"provider":null,"username":"test","email":"test@test.test","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null}],"_matchContext":null}],"roles":["Updater","SuperDataEntry"],"computedToken":"9838888df250a8022d0c8b0916cc7fc75aca77e7","tokenTimeToExpireMS":9920372,"roleQueryOnly":false,"identifier":"test","permissions":[],"_namespace":null,"_matchContext":null},
{"id":1,"version":2,"namespace":null,"created":1588101953073,"modified":1588192901582,"deprecated":false,"user":{"id":1,"version":1,"namespace":null,"created":1588101953023,"modified":1588101953066,"deprecated":false,"provider":null,"username":"admin","email":"","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null},"active":true,"systemAuth":false,"key":"mrck5pevrnHnYizzQr8J","properties":[],"groups":[{"name":"sysadmin","id":1,"members":[{"id":1,"version":1,"namespace":null,"created":1588101953023,"modified":1588101953066,"deprecated":false,"provider":null,"username":"admin","email":"","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null}],"_matchContext":null},{"name":"testGroup","id":34,"members":[{"id":1,"version":1,"namespace":null,"created":1588101953023,"modified":1588101953066,"deprecated":false,"provider":null,"username":"admin","email":"","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null},{"id":34,"version":2,"namespace":null,"created":1588191987797,"modified":1588193156341,"deprecated":false,"provider":null,"username":"test","email":"test@test.test","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null}],"_matchContext":null},{"name":"admin","id":33,"members":[{"id":1,"version":1,"namespace":null,"created":1588101953023,"modified":1588101953066,"deprecated":false,"provider":null,"username":"admin","email":"","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null},{"id":34,"version":2,"namespace":null,"created":1588191987797,"modified":1588193156341,"deprecated":false,"provider":null,"username":"test","email":"test@test.test","admin":false,"uri":null,"selfie":null,"_namespace":null,"_matchContext":null}],"_matchContext":null}],"roles":["Updater","Admin","Query","SuperUpdate","DataEntry","SuperDataEntry","Approver"],"computedToken":"e6684d7f242053a0a77074643f9e1bec174360b0","tokenTimeToExpireMS":9825720,"roleQueryOnly":false,"identifier":"admin","permissions":[],"_namespace":null,"_matchContext":null}];

  constructor(
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,

  ) { }

  ngOnInit() {
    this.test = this.users;
    this.overlayContainer = this.overlayContainerService.getContainerElement();

}

  editUser(user: any) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {'user': user},
      width: '1000px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
      }
    });
  }

}
