import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Link, Site} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-disulfide-links-form',
  templateUrl: './disulfide-links-form.component.html',
  styleUrls: ['./disulfide-links-form.component.scss']
})
export class DisulfideLinksFormComponent implements OnInit, AfterViewInit {

  private privateLink: Link;
  public cysteine: Array<Site>;
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

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,

    private substanceFormService: SubstanceFormService,
    private overlayContainerService: OverlayContainer
  ) { }

  ngOnInit() {
    if (this.privateLink.sites) {
      this.testForm.controls['site0'].setValue(this.privateLink.sites[0]);
      this.testForm.controls['site1'].setValue(this.privateLink.sites[1]);
    } else {
      this.privateLink.sites = [{}, {}];
    }
  }
    ngAfterViewInit() {
    console.log(this.privateLink);
    const cysteineSubscription = this.substanceFormService.substanceCysteineSites.subscribe(cysteine => {
      this.cysteine = cysteine;
      this.subscriptions.push(cysteineSubscription);
      //this.name.setValue(this.cysteine[0]);

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
    if (!this.privateLink
    ) {
      this.deleteTimer = setTimeout(() => {
        this.linkDeleted.emit(this.link);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateLink.$$deletedCode;
  }

  updateAccess(access: Array<string>): void {
    this.link.access = access;
  }

  updateSuggestions(value: Site, pos: number): void {
    console.log('update sug');
    console.log(value);
    this.cysteine = this.cysteine.filter(function(r) { return (r.residueIndex !== value.residueIndex) || (r.subunitIndex !== value.subunitIndex); });
    if (this.privateLink.sites[pos] !== value) {
      if (this.privateLink.sites[pos].residueIndex) {
        this.cysteine.push(this.privateLink.sites[pos]);
      }
      this.privateLink.sites[pos] = value;
      this.substanceFormService.emitCysteineUpdate(this.cysteine);
    } else {
    }
    this.testForm.controls['site' + pos].setValue(value);
  }


}
