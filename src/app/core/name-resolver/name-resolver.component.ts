import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoadingService } from '../loading/loading.service';
import { SubstanceSummary} from '../substance/substance.model';
import {PagingResponse} from '../utils/paging-response.model';
import {forkJoin} from 'rxjs';
import { ResolverResponse } from '../structure/structure-post-response.model';
import { SubstanceService } from '../substance/substance.service';
import { StructureService } from '../structure/structure.service';
import { ConfigService, ExternalSiteWarning } from '@gsrs-core/config';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ExternalSiteWarningDialogComponent } from './external-site-warning-dialog/external-site-warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-name-resolver',
  templateUrl: './name-resolver.component.html',
  styleUrls: ['./name-resolver.component.scss']
})
export class NameResolverComponent implements OnInit {
  resolverControl = new FormControl();
  resolved: string;
  errorMessage: string;
  resolvedNames: Array<ResolverResponse>;
  matchedNames: PagingResponse<SubstanceSummary>;
  @Output() structureSelected = new EventEmitter<string>();
  @Input() startingName?: string;
  // External site warning dialog for precisionFDA
  externalSiteWarning: ExternalSiteWarning;
  private overlayContainer: HTMLElement;

  constructor(
    private configService: ConfigService,
    private loadingService: LoadingService,
    private substanceService: SubstanceService,
    private structureService: StructureService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer
    ) { }

  ngOnInit() {
    this.externalSiteWarning = this.configService.configData.externalSiteWarning;
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    if (this.startingName) {
      this.resolverControl.setValue(this.startingName);
      setTimeout( () => {
        this.resolveName(this.startingName);
      });
    }
  }

  resolveNameKey(event: any): void {
    if (event.keyCode === 13) {
      this.resolveName(this.resolverControl.value);
    }
  }

  resolveName(name: string): void {
    if (this.shouldShowExternalSiteWarningDialog() === true) {
      this.showExternalSiteWarningDialog();
      return;
    }

    this.resolveNameInternal(name);
  }

  resolveNameInternal(name: string): void {
    this.errorMessage = '';
    this.resolvedNames = [];
    this.matchedNames = null;
    this.loadingService.setLoading(true);
    const n = name.replace('"', '');
    const searchStr = `root_names_name:"^${n}$" OR root_approvalID:"^${n}$" OR root_codes_BDNUM:"^${n}$"`;
    forkJoin([this.substanceService.getQuickSubstancesSummaries(searchStr),
      this.structureService.resolveName(name)]).subscribe(([local, remote]) => {
        this.loadingService.setLoading(false);
        this.resolvedNames = remote;
        this.matchedNames = local;
        if (this.matchedNames.content.length === 0 && this.resolvedNames.length === 0) {
         this.errorMessage = 'no results found for \'' + name + '\'';
        }
      },
      error => {
        this.errorMessage = 'there was a problem returning your query';

        this.loadingService.setLoading(false);
      });
  }

  applyStructure(molfile: string) {
    this.structureSelected.emit(molfile);
  }

  shouldShowExternalSiteWarningDialog(): boolean {
    if (!this.externalSiteWarning || !this.externalSiteWarning.enabled) {
      return false;
    }
    return localStorage.getItem('externalSiteWarningDontAskAgain') != 'true';
  }

  showExternalSiteWarningDialog(): void {
    const dialogRef = this.dialog.open(ExternalSiteWarningDialogComponent, {
      width: '800px',
      autoFocus: false
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response) {
        this.resolveNameInternal(this.resolverControl.value);
      }
    });
  }
}
