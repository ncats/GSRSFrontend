import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  OnDestroy, HostListener
} from '@angular/core';
import { formSections } from './form-sections.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { SubstanceFormSection } from './substance-form-section';
import { SubstanceFormService } from './substance-form.service';
import {ValidationMessage, SubstanceFormResults, SubstanceFormDefinition} from './substance-form.model';
import { Subscription } from 'rxjs';
import {SubstanceReference} from '@gsrs-core/substance';
import {RefernceFormDialogComponent} from '@gsrs-core/substance-form/references-dialogs/refernce-form-dialog.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MatDialog} from '@angular/material/dialog';
import {JsonDialogComponent} from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import * as _ from 'lodash';
import * as defiant from '../../../../node_modules/defiant.js/dist/defiant.min.js';
import {Title} from '@angular/platform-browser';
import {Auth, AuthService} from '@gsrs-core/auth';
import {take} from 'rxjs/operators';



@Component({
  selector: 'app-substance-form',
  templateUrl: './substance-form.component.html',
  styleUrls: ['./substance-form.component.scss']
})
export class SubstanceFormComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  id?: string;
  formSections: Array<SubstanceFormSection> = [];
  @ViewChildren('dynamicComponent', { read: ViewContainerRef }) dynamicComponents: QueryList<ViewContainerRef>;
  private subClass: string;
  private definitionType: string;
  expandedComponents = [
    'substance-form-definition',
    'substance-form-structure',
    'substance-form-moieties',
    'substance-form-references'
  ];
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage>;
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  canApprove: boolean;
  approving: boolean;
  definition: SubstanceFormDefinition;
  user: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private dynamicComponentLoader: DynamicComponentLoader,
    private gaService: GoogleAnalyticsService,
    private substanceFormService: SubstanceFormService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private authService: AuthService,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['id']) {
          const id = params['id'];
          if (id !== this.id) {
            this.id = id;
            this.gaService.sendPageView(`Substance Edit`);
            const newType = this.activatedRoute.snapshot.queryParamMap.get('switch') || null;
            if (newType) {
              this.getSubstanceDetails(newType);
            } else {
              this.getSubstanceDetails();
            }
          }
        } else {
          this.copy = this.activatedRoute.snapshot.queryParams['copy'] || null;
          if (this.copy) {
            const copyType = this.activatedRoute.snapshot.queryParams['copyType'] || null;
            this.getPartialSubstanceDetails(this.copy, copyType);
            this.gaService.sendPageView(`Substance Register`);
          } else {
          setTimeout(() => {
            this.gaService.sendPageView(`Substance Register`);
            this.subClass = this.activatedRoute.snapshot.params['type'] || 'chemical';
            this.substanceFormService.loadSubstance(this.subClass);
            this.setFormSections(formSections[this.subClass]);
            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
          }
        }
      });
    this.subscriptions.push(routeSubscription);
    this.titleService.setTitle('Register');
    this.approving = false;
    this.substanceFormService.definition.subscribe(response => {
      this.definition = response;
      setTimeout(() => {
        this.canApprove = this.canBeApproved();
      });
    });
    this.authService.getAuth().pipe(take(1)).subscribe(auth => {
      this.user = auth.identifier;
      setTimeout(() => {
        this.canApprove = this.canBeApproved();
      });
    });

  }

  ngAfterViewInit(): void {
    const subscription = this.dynamicComponents.changes
      .subscribe(() => {
        this.dynamicComponents.forEach((cRef, index) => {
          this.dynamicComponentLoader
              .getComponentFactory<any>(this.formSections[index].dynamicComponentName)
              .subscribe(componentFactory => {
                this.formSections[index].dynamicComponentRef = cRef.createComponent(componentFactory);
                this.formSections[index].dynamicComponentRef.instance.menuLabelUpdate.subscribe(label => {
                  this.formSections[index].menuLabel = label;
                });
                this.formSections[index].dynamicComponentRef.instance.hiddenStateUpdate.subscribe(isHidden => {
                  this.formSections[index].isHidden = isHidden;
                });
                this.formSections[index].dynamicComponentRef.changeDetectorRef.detectChanges();
              });
        });
        subscription.unsubscribe();
      });
  }

  ngOnDestroy(): void {
    this.substanceFormService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  canBeApproved(): boolean {
    if (this.definition && this.definition.lastEditedBy && this.user) {
      const lastEdit = this.definition.lastEditedBy;
      if (!lastEdit) {
        return false;
      }
      if (this.definition.status === 'approved') {
        return false;
      }
      if (lastEdit === this.user) {
        return false;
      }
    }
    return true;
  }

  showJSON(): void {
      const dialogRef = this.dialog.open(JsonDialogComponent, {
        width: '90%'
      });
      this.overlayContainer.style.zIndex = '1002';

      const dialogSubscription = dialogRef.afterClosed().subscribe(response => {

      });
      this.subscriptions.push(dialogSubscription);
  }

  getSubstanceDetails(newType?: string): void {
    this.substanceService.getSubstanceDetails(this.id).subscribe(response => {
      if (response) {
        this.definitionType = response.definitionType;
        if (newType) {
          response = this.substanceFormService.switchType(response, newType);
        }
        this.substanceFormService.loadSubstance(response.substanceClass, response);
        this.setFormSections(formSections[response.substanceClass]);
      } else {
        this.handleSubstanceRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.gaService.sendException('getSubstanceDetails: error from API call');
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleSubstanceRetrivalError();
    });
  }

  getPartialSubstanceDetails(uuid: string, type: string): void {
    this.substanceService.getSubstanceDetails(uuid).subscribe(response => {
      if (response) {
        delete response.uuid;
        if (response._name) {
          delete response._name;
        }
        this.scrub(response, type);
        this.substanceFormService.loadSubstance(response.substanceClass, response);
        this.setFormSections(formSections[response.substanceClass]);
      } else {
        this.handleSubstanceRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.gaService.sendException('getSubstanceDetails: error from API call');
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleSubstanceRetrivalError();
    });
  }


  private setFormSections(sectionNames: Array<string> = []): void {
    this.formSections = [];
    sectionNames.forEach(sectionName => {
      const formSection = new SubstanceFormSection(sectionName);
      if (!this.definitionType || !(this.definitionType === 'ALTERNATIVE' &&
        (formSection.dynamicComponentName === 'substance-form-names' || formSection.dynamicComponentName === 'substance-form-codes'))) {
        this.formSections.push(formSection);
      }
    });
  }

  private handleSubstanceRetrivalError() {
    const notification: AppNotification = {
      message: 'The substance you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/substances/register']);
      this.substanceFormService.loadSubstance(this.subClass);
      this.setFormSections(formSections.chemical);
    }, 5000);
  }

  validate(validationType?: string ): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);
    this.substanceFormService.validateSubstance().subscribe(results => {
      this.submissionMessage = null;
      this.validationMessages = results.validationMessages.filter(
        message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
      this.validationResult = results.valid;
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;
      if (this.validationMessages.length === 0 && results.valid === true) {
        this.submissionMessage = 'Substance is Valid. Would you like to submit?';
      }
      if (validationType && validationType === 'approval' ) {
        this.approving = true;
        this.submissionMessage = 'Are you sure you\'d like to approve this substance?';
      }
    }, error => {
      this.addServerError(error);
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });
  }

  approve(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.substanceFormService.approveSubstance().subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'Substance was Approved. Please refresh now or allow the page to refresh before editing.';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        const id = this.substanceFormService.getUuid();
          this.router.navigate(['/substances', id, 'edit']);
      }, 4000);
    },
      (error: SubstanceFormResults) => {
        this.showSubmissionMessages = true;
        this.loadingService.setLoading(false);
        this.isLoading = false;
          this.submissionMessage = 'Substance Could not be approved';
          this.addServerError(error.serverError);
          setTimeout(() => {
            this.showSubmissionMessages = false;
            this.submissionMessage = null;
          }, 10000);
        }
      );
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.substanceFormService.saveSubstance().subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'Substance was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        if (!this.id) {
          this.id = response.uuid;
          this.router.navigate(['/substances', response.uuid, 'edit']);
        }
      }, 4000);
    }, (error: SubstanceFormResults) => {
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.submissionMessage = null;
      if (error.validationMessages && error.validationMessages.length) {
        this.validationResult = error.isSuccessfull;
        this.validationMessages = error.validationMessages
          .filter(message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
        this.showSubmissionMessages = true;
      } else {
        this.submissionMessage = 'There was a problem with your submission';
        this.addServerError(error.serverError);
        setTimeout(() => {
          this.showSubmissionMessages = false;
          this.submissionMessage = null;
        }, 8000);
      }
    });
  }

  dismissValidationMessage(index: number) {
    this.validationMessages.splice(index, 1);

    if (this.validationMessages.length === 0) {
      this.submissionMessage = 'Substance is Valid. Would you like to submit?';
    }
  }

  addServerError (error: any): void {
    this.serverError = true;
    this.validationResult = false;
    this.validationMessages = null;

    const message: ValidationMessage = {
      actionType: 'server failure',
      links: [],
      appliedChange: false,
      suggestedChange: false,
      messageType : 'ERROR',
      message : 'Unknown Server Error'
    };
    if ( error && error.error && error.error.message ) {
      message.message =  'Server Error ' + (error.status + ': ' || ': ') + error.error.message;
    } else if ( error && error.error && (typeof error.error) === 'string') {
        message.message = 'Server Error ' + (error.status + ': ' || '') + error.error;
    } else if ( error && error.message ) {
      message.message = 'Server Error ' + (error.status + ': ' || '') + error.message;
    }
    this.validationMessages = [message];
    this.showSubmissionMessages = true;
  }

  toggleValidation(): void {
    this.showSubmissionMessages = !this.showSubmissionMessages;
  }

  dismissAllValidationMessages(): void {
    for (let i = this.validationMessages.length - 1; i >= 0; i--) {
      if ( this.validationMessages[i].messageType !== 'ERROR') {
        this.validationMessages.splice(i, 1);
      }
    }
    if (this.validationMessages.length === 0) {
      this.submissionMessage = 'Substance is Valid. Would you like to submit?';
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
      if (this.substanceFormService.isSubstanceUpdated) {
          $event.returnValue = true;
      }
  }

  scrub(oldraw: any, importType: string): any {
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
    const old = oldraw;
    const uuidHolders = defiant.json.search(old, '//*[uuid]');
    const map = {};
    for (let i = 0; i < uuidHolders.length; i++) {
      const ouuid = uuidHolders[i].uuid;
      if (map[ouuid]) {
        uuidHolders[i].uuid = map[ouuid];
        if (uuidHolders[i].id) {
             uuidHolders[i].id = map[ouuid];
        }
      } else {
        const nid = guid();
        uuidHolders[i].uuid = nid;
        map[ouuid] = nid;
        if (uuidHolders[i].id) {
             uuidHolders[i].id = nid;
        }
      }
    }
    const refHolders = defiant.json.search(old, '//*[references]');
    for (let i = 0; i < refHolders.length; i++) {
      const refs = refHolders[i].references;
      for (let j = 0; j < refs.length; j++) {
        const or = refs[j];
        if (typeof or === 'object') { continue; }
        refs[j] = map[or];
      }
    }
    defiant.json.search(old, '//*[uuid]');
    _.remove(old.codes, {
      codeSystem: 'BDNUM'
    });
    const createHolders = defiant.json.search(old, '//*[created]');
    for (let i = 0; i < createHolders.length; i++) {
      const rec = createHolders[i];
      delete rec['created'];
      delete rec['createdBy'];
      delete rec['lastEdited'];
      delete rec['lastEditedBy'];
    }
    delete old.approvalID;
    delete old.approved;
    delete old.approvedBy;
    old.status = 'pending';
    if ((importType) && (importType === 'definition')) {
      old.names = [];
      old.codes = [];
      old.notes = [];
      old.relationships = [];
    }
    delete old['createdBy'];
    delete old['created'];
    delete old['lastEdited'];
    delete old['lastEditedBy'];
    delete old['version'];
    delete old['$$update'];
    delete old['changeReason'];


    if (true) {
      const refSet = {};

      const refHolders2 = defiant.json.search(old, '//*[references]');
      for (let i = 0; i < refHolders2.length; i++) {
        const refs = refHolders2[i].references;
        for (let j = 0; j < refs.length; j++) {
          const or = refs[j];
          if (typeof or === 'object') { continue; }
          refSet[or] = true;
        }
      }

      const nrefs = _.chain(old.references)
        .filter(function(ref) {
          if (refSet[ref.uuid]) {
            return true;
          } else {
            return false;
          }
        })
        .value();

      old.references = nrefs;

    }


    return old;
  }
}
