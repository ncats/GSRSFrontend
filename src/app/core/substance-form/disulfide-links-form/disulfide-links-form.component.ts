import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Link, Site} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';

@Component({
  selector: 'app-disulfide-links-form',
  templateUrl: './disulfide-links-form.component.html',
  styleUrls: ['./disulfide-links-form.component.scss']
})
export class DisulfideLinksFormComponent implements OnInit, AfterViewInit, OnDestroy {

  private privateLink: Link;
  public cysteine: Array<Site> = [];
  @Output() linkDeleted = new EventEmitter<Link>();
  deleteTimer: any;
  testForm = new FormGroup({
    site0: new FormControl('', [
      Validators.required
    ]),
    site1: new FormControl('', [
      Validators.required
    ]),
  });
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer,
    private substanceFormService: SubstanceFormService,
  ) { }

  ngOnInit() {
    if (this.privateLink.sites) {
      this.testForm.controls['site0'].setValue(this.privateLink.sites[0]);
      this.testForm.controls['site1'].setValue(this.privateLink.sites[1]);
    } else {
      this.privateLink.sites = [{}, {}];
    }
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }
    ngAfterViewInit() {
      setTimeout(() => {
        const cysteineSubscription = this.substanceFormService.substanceCysteineSites.subscribe(cysteine => {
          this.cysteine = cysteine;
        });
        this.subscriptions.push(cysteineSubscription);

      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set link(link: Link) {
    this.privateLink = link;
  }

  get link(): Link {
    return this.privateLink;
  }

  deleteLink(): void {
    this.privateLink.$$deletedCode = this.utilsService.newUUID();
   // if (!this.privateLink) {
      this.deleteTimer = setTimeout(() => {
        this.linkDeleted.emit(this.link);
      }, 1000);
    //}
    this.substanceFormService.emitDisulfideLinkUpdate();
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateLink.$$deletedCode;
    this.substanceFormService.emitDisulfideLinkUpdate();
  }

  updateAccess(access: Array<string>): void {
    this.link.access = access;
  }

  updateSuggestions(value: Site, pos: number): void {
    this.cysteine = this.cysteine.filter(function(r) { return (r.residueIndex !== value.residueIndex) || (r.subunitIndex !== value.subunitIndex); });
    if (this.privateLink.sites[pos] !== value) {
      if (this.privateLink.sites[pos].residueIndex) {
        this.cysteine.push(this.privateLink.sites[pos]);
      }
      this.privateLink.sites[pos] = value;
      this.substanceFormService.emitCysteineUpdate(this.cysteine);
      this.substanceFormService.emitDisulfideLinkUpdate();
    } else {
    }
    this.testForm.controls['site' + pos].setValue(value);
  }

  openDialog(): void {
    let sentSites = this.privateLink.sites;
    if (!sentSites[0].residueIndex || !sentSites[1].residueIndex) {
      sentSites = [];
    }
    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'disulfide', 'link': sentSites},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newLinks => {
      this.overlayContainer.style.zIndex = null;
      if (newLinks) {
        if (newLinks[0] && newLinks[0].subunitIndex) {
          this.privateLink.sites[0] = newLinks[0];
          this.testForm.controls['site0'].setValue(this.privateLink.sites[0]);
        } else {
          this.privateLink.sites[0] = {};
          this.testForm.controls['site0'].reset();
        }
        if (newLinks[1] && newLinks[1].subunitIndex) {
          this.privateLink.sites[1] = newLinks[1];
          this.testForm.controls['site1'].setValue(this.privateLink.sites[1]);
        } else {
          this.privateLink.sites[1] = {};
          this.testForm.controls['site1'].reset();
        }
      }
      this.substanceFormService.emitDisulfideLinkUpdate();
    });
    this.subscriptions.push(dialogSubscription);
  }

}
