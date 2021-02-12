import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesSubstance, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria, SubRelationship } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-substance-form',
  templateUrl: './impurities-substance-form.component.html',
  styleUrls: ['./impurities-substance-form.component.scss']
})
export class ImpuritiesSubstanceFormComponent implements OnInit {

  @Input() impuritiesSubstance: ImpuritiesSubstance;
  @Input() impuritiesSubstanceIndex: number;

  constructor(
    private impuritiesService: ImpuritiesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  addNewTest() {
    this.impuritiesService.addNewTest(this.impuritiesSubstanceIndex);
  }
}
