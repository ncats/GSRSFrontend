import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, HostListener} from '@angular/core';
import {MixtureComponents, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CvInputComponent} from '@gsrs-core/substance-form/cv-input/cv-input.component';
import {SubstanceSelectorComponent} from '@gsrs-core/substance-selector/substance-selector.component';

@Component({
    selector: 'app-mixture-component-form',
    templateUrl: './mixture-component-form.component.html',
    styleUrls: ['./mixture-component-form.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, CvInputComponent, SubstanceSelectorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MixtureComponentFormComponent implements OnInit {
  private privateComp: MixtureComponents;
  @Output() componentDeleted = new EventEmitter<MixtureComponents>();
  deleteTimer: any;
  relatedSubstanceUuid: string;
  private overlayContainer: HTMLElement;
  siteDisplay: string;
  invalid = false;

  @HostListener('focusout') onFocusout() {
    if (!this.privateComp.type) {
      this.invalid = true;
    } else {
      this.invalid = false;
    }
  }

  constructor(
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer
  ) { }
  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  @Input()
  set component(component: MixtureComponents) {
    this.privateComp = component;
    if (this.privateComp.substance) {
      this.relatedSubstanceUuid = this.privateComp.substance.refuuid;
    }

  }

  get component(): MixtureComponents {
    return this.privateComp;
  }

  updateType(event: any): void {
    this.privateComp.type = event;
    if (!this.privateComp.type) {
      this.invalid = true;
    } else {
      this.invalid = false;
    }
  }

  


  deleteComponent(): void {
    this.privateComp.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateComp || !this.component
    ) {
      this.deleteTimer = setTimeout(() => {
        this.componentDeleted.emit(this.privateComp);
      }, 1000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateComp.$$deletedCode;
  }

  componentUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.component.substance = relatedSubstance;
    this.relatedSubstanceUuid = this.component.substance.refuuid;
  }

}
