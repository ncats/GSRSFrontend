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
import { ValidationMessage, SubstanceFormResults } from './substance-form.model';
import { Subscription } from 'rxjs';
import {SubstanceReference} from '@gsrs-core/substance';
import {RefernceFormDialogComponent} from '@gsrs-core/substance-form/references-dialogs/refernce-form-dialog.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MatDialog} from '@angular/material/dialog';
import {JsonDialogComponent} from '@gsrs-core/substance-form/json-dialog/json-dialog.component';

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
        if (type) {
          response.names = [];
          response.notes = [];
          response.codes = [];
          if (response._name) {
            delete response._name;
          }
          response.relationships = [];
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


  private setFormSections(sectionNames: Array<string> = []): void {
    this.formSections = [];
    sectionNames.forEach(sectionName => {
      const formSection = new SubstanceFormSection(sectionName);
      this.formSections.push(formSection);
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

  validate(): void {
    this.isLoading = true;
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
    }, error => {
      console.log(error);
      this.validationResult = false;
      this.validationMessages = null;
      this.submissionMessage = 'There are undetermined are errors with your substance. Please make some changes and try validating again';
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });
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
        this.validationMessages = null;
        this.submissionMessage = 'There was a problem with your submission';
        this.showSubmissionMessages = true;
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
}
