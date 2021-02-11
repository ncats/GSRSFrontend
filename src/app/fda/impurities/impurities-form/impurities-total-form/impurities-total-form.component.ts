import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesDetails, IdentityCriteria, ImpuritiesUnspecified, SubRelationship, ValidationMessage, ImpuritiesTotal } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-total-form',
  templateUrl: './impurities-total-form.component.html',
  styleUrls: ['./impurities-total-form.component.scss']
})
export class ImpuritiesTotalFormComponent implements OnInit {

  @Input() impuritiesTotal: ImpuritiesTotal;
  @Input() impuritiesTotalIndex: number;

  constructor(
    private impuritiesService: ImpuritiesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  //  alert(this.impuritiesTotalIndex);
  //  this.addNewImpuritiesTotal();
  }

  addNewImpuritiesTotal() {
    this.impuritiesService.addNewImpuritiesTotal();
  }

}
