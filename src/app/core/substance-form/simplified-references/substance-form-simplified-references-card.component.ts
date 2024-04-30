import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '../base-classes/substance-form-base-filtered-list';
import {SubstanceReference} from '@gsrs-core/substance/substance.model';
import {MatDialog} from '@angular/material/dialog';
import {ScrollToService} from '../../scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {combineLatest, first, Subscription} from 'rxjs';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormReferencesService} from "@gsrs-core/substance-form/references/substance-form-references.service";
import {DomainsWithReferences} from "@gsrs-core/substance-form/references/domain-references/domain.references.model";
import {domainKeys} from '../references/domain-references/domain-keys.constant';
import {take} from "rxjs/operators";
import {SubstanceFormService} from "@gsrs-core/substance-form/substance-form.service";
import {SubstanceFormNamesService} from "@gsrs-core/substance-form/names/substance-form-names.service";
import {SubstanceFormCodesService} from "@gsrs-core/substance-form/codes/substance-form-codes.service";
import {SubstanceFormStructureService} from "@gsrs-core/substance-form/structure/substance-form-structure.service";

@Component({
  selector: 'app-substance-form-references-card',
  templateUrl: './substance-form-simplified-references-card.component.html',
  styleUrls: ['./substance-form-simplified-references-card.component.scss']
})
export class SubstanceFormSimplifiedReferencesCardComponent extends SubstanceCardBaseFilteredList<SubstanceReference>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  references: Array<SubstanceReference>;
  private domainKeys = domainKeys;
  private domainsWithReferences: DomainsWithReferences;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceFormReferencesService: SubstanceFormReferencesService,
    private substanceFormNamesService: SubstanceFormNamesService,
    private substanceFormCodesService: SubstanceFormCodesService,
    private substanceFormStructureService: SubstanceFormStructureService,
    private dialog: MatDialog,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form references';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('References');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit() {
    const referencesSubscription = this.substanceFormReferencesService.substanceReferences.subscribe(references => {
      this.references = references;
      this.filtered = references;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.references, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });

    // Ensure all simplified references are added to all elements.
    const nameApplySubscription = this.substanceFormNamesService.substanceNames.subscribe(()=>this.applyAllReferencesToAll())
    const codesApplySubscription = this.substanceFormCodesService.substanceCodes.subscribe(()=>this.applyAllReferencesToAll())
    const structureApplySubscription = this.substanceFormStructureService.substanceStructure.subscribe(()=>this.applyAllReferencesToAll())

    const domainsSubscription = this.substanceFormReferencesService.domainsWithReferences.pipe(take(1)).subscribe(domainsWithReferences => {
      this.domainsWithReferences = domainsWithReferences;
    });

    this.subscriptions.push(referencesSubscription);
    this.subscriptions.push(nameApplySubscription);
    this.subscriptions.push(codesApplySubscription);
    this.subscriptions.push(structureApplySubscription);
    this.subscriptions.push(domainsSubscription);

    // Init default.
    const defaultSubscription = combineLatest([this.substanceFormService.simplifiedForm, this.substanceFormReferencesService.substanceReferences.pipe(first())]).subscribe({
      next: ([simplified, references]) => {
        if (simplified && references.length == 0){
          this.addDefaultSubstanceReference()
        }
      },
      error: error => {
        console.error(error);
      }
    });
    this.subscriptions.push(defaultSubscription)
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addSubstanceReference();
  }

  addDefaultSubstanceReference(): void {
    const addedReference = this.substanceFormReferencesService.addSubstanceReference(
      {docType: "MANUFACTURER PRODUCT DESCRIPTION", citation: ""}
    );
    this.applyToAll(addedReference.uuid)
  }

  addSubstanceReference(): void {
    const addedReference = this.substanceFormReferencesService.addSubstanceReference({});
    this.applyToAll(addedReference.uuid)

    setTimeout(() => {
      this.scrollToService.scrollToElement(addedReference.uuid, 'center');
    }, 10);
  }

  applyAllReferencesToAll(): void {
    for(const ref of this.references){
      this.applyToAll(ref.uuid)
    }
  }

  deleteReference(reference: SubstanceReference): void {
    this.substanceFormReferencesService.deleteSubstanceReference(reference);
  }

  applyToAll(uuid: string): void {
    this.applyReference(this.domainsWithReferences.definition.domain, uuid);
    this.domainKeys.map(key => this.domainsWithReferences[key]?.domains).forEach(domains => {
      if (domains) {
        domains.forEach((domain: any) => {
          this.applyReference(domain, uuid);
        });
      }
    });

    this.substanceFormReferencesService.emitReferencesUpdate();
  }

  applyReference(domain: any, uuid: string): void {
    if (!domain.references) {
      domain.references = [];
    }

    if (domain.references.indexOf(uuid) === -1) {
      domain.references.push(uuid);
    }
  }
}
