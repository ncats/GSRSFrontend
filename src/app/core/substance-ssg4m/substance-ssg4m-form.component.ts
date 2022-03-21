import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  OnDestroy, HostListener
} from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { take, map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as defiant from '../../../../node_modules/defiant.js/dist/defiant.min.js';
import { Title } from '@angular/platform-browser';
// GSRS Import
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';
import { formSections } from '../substance-form/form-sections.constant';
import { SubstanceFormSection } from '../substance-form/substance-form-section';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '../loading/loading.service';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceFormService } from '../substance-form/substance-form.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { ValidationResults } from '../substance-form/substance-form.model';
import { ValidationMessage, SubstanceFormResults, SubstanceFormDefinition } from '../substance-form/substance-form.model';
import { SubmitSuccessDialogComponent } from '../substance-form/submit-success-dialog/submit-success-dialog.component';
import { MergeConceptDialogComponent } from '@gsrs-core/substance-form/merge-concept-dialog/merge-concept-dialog.component';
import { DefinitionSwitchDialogComponent } from '@gsrs-core/substance-form/definition-switch-dialog/definition-switch-dialog.component';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { JsonDialogComponent } from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import { SubstanceSsg4mService } from './substance-ssg4m-form.service';

@Component({
  selector: 'app-substance-ssg4m-form',
  templateUrl: './substance-ssg4m-form.component.html',
  styleUrls: ['./substance-ssg4m-form.component.scss']
})
export class SubstanceSsg4ManufactureFormComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  id?: string;
  formSections: Array<SubstanceFormSection> = [];
  @ViewChildren('dynamicComponent', { read: ViewContainerRef }) dynamicComponents: QueryList<ViewContainerRef>;
  @ViewChildren('expansionPanel', { read: MatExpansionPanel }) matExpansionPanels: QueryList<MatExpansionPanel>;
  private subClass: string;
  definitionType: string;
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
  feature: string;
  isAdmin: boolean;
  isUpdater: boolean;
  messageField: string;
  uuid: string;
  substanceClass: string;
  status: string;
  classes = [
    'concept',
    'protein',
    'chemical',
    'structurallyDiverse',
    'polymer',
    'nucleicAcid',
    'mixture',
    'specifiedSubstanceG1',
    'specifiedSubstanceG2',
    'specifiedSubstanceG3',
    'specifiedSubstanceG4m'];
  imported = false;
  forceChange = false;
  sameSubstance = false;
  UNII: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private dynamicComponentLoader: DynamicComponentLoader,
    private gaService: GoogleAnalyticsService,
    private substanceSsg4mService: SubstanceSsg4mService,
    private substanceFormService: SubstanceFormService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private authService: AuthService,
    private titleService: Title
  ) {
  }

  importDialog(): void {
    const dialogRef = this.dialog.open(SubstanceEditImportDialogComponent, {
      width: '650px',
      autoFocus: false

    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      if (response) {
        this.loadingService.setLoading(true);
        this.overlayContainer.style.zIndex = null;

        // attempting to reload a substance without a router refresh has proven to cause issues with the relationship dropdowns
        // There are probably other components affected. There is an issue with subscriptions likely due to some OnInit not firing

        /* const read = JSON.parse(response);
         if (this.id && read.uuid && this.id === read.uuid) {
           this.substanceFormService.importSubstance(read, 'update');
           this.submissionMessage = null;
           this.validationMessages = [];
           this.showSubmissionMessages = false;
           this.loadingService.setLoading(false);
           this.isLoading = false;
         } else {
         if ( read.substanceClass === this.substanceClass) {
           this.imported = true;
           this.substanceFormService.importSubstance(read);
           this.submissionMessage = null;
           this.validationMessages = [];
           this.showSubmissionMessages = false;
           this.loadingService.setLoading(false);
           this.isLoading = false;
         } else {*/
        setTimeout(() => {
          this.router.onSameUrlNavigation = 'reload';
          this.loadingService.setLoading(false);
          this.router.navigateByUrl('/substances-ssg4m/register?action=import', { state: { record: response } });

        }, 1000);
      }
      // }
      // }
    });

  }

  test() {
    this.router.navigated = false;
    this.router.navigate([this.router.url]);
  }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.isAdmin = this.authService.hasRoles('admin');
    this.isUpdater = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.imported = false;
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
          const action = this.activatedRoute.snapshot.queryParams['action'] || null;
          if (action && action === 'import' && window.history.state) {
            const record = window.history.state;
            this.imported = true;
            this.getDetailsFromImport(record.record);
            this.gaService.sendPageView(`Substance Register`);
          } else {
            this.copy = this.activatedRoute.snapshot.queryParams['copy'] || null;
            if (this.copy) {
              const copyType = this.activatedRoute.snapshot.queryParams['copyType'] || null;
              this.getPartialSubstanceDetails(this.copy, copyType);
              this.gaService.sendPageView(`Substance Register`);
            } else {
              setTimeout(() => {
                this.gaService.sendPageView(`Substance Register`);
                this.subClass = this.activatedRoute.snapshot.params['type'] || 'specifiedSubstanceG4m';
                this.substanceClass = this.subClass;
                this.titleService.setTitle('Register - Specified Substance Group 4 Manufacturing');
                this.substanceFormService.loadSubstance(this.subClass).pipe(take(1)).subscribe(() => {
                // this.substanceSsg4mService.loadSubstance(this.subClass).pipe(take(1)).subscribe(() => {
                  this.setFormSections(formSections[this.subClass]);
                  this.loadingService.setLoading(false);
                  this.isLoading = false;
                });
              });
            }
          }
        }
      });
    this.subscriptions.push(routeSubscription);
    const routerSubscription = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.substanceSsg4mService.unloadSubstance();
      }
    });
    this.subscriptions.push(routerSubscription);
    this.approving = false;
    /* // Commenting this out
    const definitionSubscription = this.substanceSsg4mService.definition.subscribe(response => {
      this.definition = response;
      setTimeout(() => {
        this.canApprove = this.canBeApproved();
      });
    });
    this.subscriptions.push(definitionSubscription);
    */
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

        const total = this.formSections.length;
        let finished = 0;
        if (!this.forceChange) {
          this.loadingService.setLoading(true);
          const startTime = new Date();
          this.dynamicComponents.forEach((cRef, index) => {
            this.dynamicComponentLoader
              .getComponentFactory<any>(this.formSections[index].dynamicComponentName)
              .subscribe(componentFactory => {
                this.loadingService.setLoading(true);
                this.formSections[index].dynamicComponentRef = cRef.createComponent(componentFactory);
                this.formSections[index].matExpansionPanel = this.matExpansionPanels.find((item, panelIndex) => index === panelIndex);
                this.formSections[index].dynamicComponentRef.instance.menuLabelUpdate.pipe(take(1)).subscribe(label => {
                  this.formSections[index].menuLabel = label;
                });
                const hiddenStateSubscription =
                  this.formSections[index].dynamicComponentRef.instance.hiddenStateUpdate.subscribe(isHidden => {
                    this.formSections[index].isHidden = isHidden;
                  });
                this.subscriptions.push(hiddenStateSubscription);
                this.formSections[index].dynamicComponentRef.instance.canAddItemUpdate.pipe(take(1)).subscribe(isList => {
                  this.formSections[index].canAddItem = isList;
                  if (isList) {
                    const aieSubscription = this.formSections[index].addItemEmitter.subscribe(() => {
                      this.formSections[index].matExpansionPanel.open();
                      this.formSections[index].dynamicComponentRef.instance.addItem();
                    });
                    this.formSections[index].dynamicComponentRef.instance.componentDestroyed.pipe(take(1)).subscribe(() => {
                      aieSubscription.unsubscribe();
                    });
                  }
                });
                this.formSections[index].dynamicComponentRef.changeDetectorRef.detectChanges();
                finished++;
                if (finished >= total) {
                  this.loadingService.setLoading(false);
                } else {
                  const currentTime = new Date();
                  if (currentTime.getTime() - startTime.getTime() > 12000) {
                    if (confirm('There was a network error while fetching files, would you like to refresh?')) {
                      window.location.reload();
                    }
                  }
                }
                setTimeout(() => {
                  this.loadingService.setLoading(false);
                  //  this.UNII = this.substanceSsg4mService.getUNII();
                }, 5);
              });
          });
          // this.loadingService.setLoading(false);

        }
        subscription.unsubscribe();
      });
  }

  openedChange(event: any) {
    if (event) {
      this.overlayContainer.style.zIndex = '1002';
    } else {
      this.overlayContainer.style.zIndex = '1000';
    }
  }

  /*
  useFeature(feature: any): void {
    this.feature = feature.value;
    if (this.feature === 'glyco') {
      this.glyco();
    } else if (this.feature === 'disulfide') {
      this.disulfide();
    } if (this.feature === 'concept') {
      this.concept();
    } if (this.feature === 'unapprove') {
      if (confirm('Are you sure you\'d like to remove the approvalID?')) {
        this.substanceFormService.unapproveRecord();
      }
      this.feature = undefined;
    }
    if (this.feature === 'setPrivate') {
      this.substanceFormService.setDefinitionPrivate();
      this.feature = undefined;
    }
    if (this.feature === 'setPublic') {
      this.substanceFormService.setDefinitionPublic();
      this.feature = undefined;
    }
    if (this.feature === 'approved') {
      this.substanceFormService.changeStatus('approved');
      this.feature = undefined;
    }
    if (this.feature === 'pending') {
      this.substanceFormService.changeStatus('pending');
      this.feature = undefined;
    }
    if (this.feature === 'merge') {
      this.mergeConcept();
      this.feature = undefined;
    }
    if (this.feature === 'switch') {
      this.definitionSwitch();
      this.feature = undefined;
    }
    if (this.feature === 'changeApproval') {
      this.substanceFormService.changeApproval();
    }

  }

  changeClass(type: any): void {
    this.router.navigate(['/substances', this.id, 'edit'], { queryParams: { switch: type.value } });
    this.feature = undefined;
  }

  changeStatus(status: any): void {
    this.substanceFormService.changeStatus(status);
    this.feature = undefined;
  }

  concept(): void {
    this.substanceFormService.conceptNonApproved();
    this.feature = undefined;
  }

  glyco(): void {
    this.substanceFormService.predictSites();
    this.feature = undefined;
  }

  disulfide(): void {
    this.substanceFormService.disulfideLinks();
    this.feature = undefined;
  }
  */

  ngOnDestroy(): void {
    // this.substanceFormService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  canBeApproved(): boolean {
    const action = this.activatedRoute.snapshot.queryParams['action'] || null;
    if (action && action === 'import') {
      return false;
    }
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
      return true;

    }
    return false;
  }

  showJSON(): void {
    const dialogRef = this.dialog.open(JsonDialogComponent, {
      width: '90%'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {

    });
    this.subscriptions.push(dialogSubscription);
  }

  getSubstanceDetails(newType?: string): void {
    this.substanceService.getSubstanceDetails(this.id).pipe(take(1)).subscribe(response => {
      if (response._name) {
        this.titleService.setTitle('Edit - ' + response._name);
      }
      if (response) {
        this.definitionType = response.definitionType;
        // if (newType) {
        //  response = this.substanceSsg4mService.switchType(response, newType);
        // }
        this.substanceClass = response.substanceClass;
        this.status = response.status;
        this.substanceSsg4mService.loadSubstance(response.substanceClass, response).pipe(take(1)).subscribe(() => {
          this.setFormSections(formSections[response.substanceClass]);
        });
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

  jsonValid(file: any): boolean {
    try {
      JSON.parse(file);
    } catch (e) {
      return false;
    }
    return true;
  }

  getDetailsFromImport(state: any, same?: boolean) {
    if (state && this.jsonValid(state)) {
      const response = JSON.parse(state);
      same = false;
      this.definitionType = response.definitionType;
      this.substanceClass = response.substanceClass;
      this.status = response.status;
      this.substanceFormService.loadSubstance(response.substanceClass, response, 'import').pipe(take(1)).subscribe(() => {
     // this.substanceSsg4mService.loadSubstance(response.substanceClass, response, 'import').pipe(take(1)).subscribe(() => {
        this.setFormSections(formSections[response.substanceClass]);
        if (!same) {
          setTimeout(() => {
            this.forceChange = true;
            this.dynamicComponents.forEach((cRef, index) => {
              this.dynamicComponentLoader
                .getComponentFactory<any>(this.formSections[index].dynamicComponentName)
                .subscribe(componentFactory => {
                  this.formSections[index].dynamicComponentRef = cRef.createComponent(componentFactory);
                  this.formSections[index].matExpansionPanel = this.matExpansionPanels.find((item, panelIndex) => index === panelIndex);
                  this.formSections[index].dynamicComponentRef.instance.menuLabelUpdate.pipe(take(1)).subscribe(label => {
                    this.formSections[index].menuLabel = label;
                  });
                  const hiddenStateSubscription =
                    this.formSections[index].dynamicComponentRef.instance.hiddenStateUpdate.subscribe(isHidden => {
                      this.formSections[index].isHidden = isHidden;
                    });
                  this.subscriptions.push(hiddenStateSubscription);
                  this.formSections[index].dynamicComponentRef.instance.canAddItemUpdate.pipe(take(1)).subscribe(isList => {
                    this.formSections[index].canAddItem = isList;
                    if (isList) {
                      const aieSubscription = this.formSections[index].addItemEmitter.subscribe(() => {
                        this.formSections[index].matExpansionPanel.open();
                        this.formSections[index].dynamicComponentRef.instance.addItem();
                      });
                      this.formSections[index].dynamicComponentRef.instance.componentDestroyed.pipe(take(1)).subscribe(() => {
                        aieSubscription.unsubscribe();
                      });
                    }
                  });
                  this.formSections[index].dynamicComponentRef.changeDetectorRef.detectChanges();
                });
            });

            this.canApprove = false;
          });
        }
      }, error => {
        this.loadingService.setLoading(false);
      });
    } else {
      this.handleSubstanceRetrivalError();
      this.loadingService.setLoading(false);

    }
    this.loadingService.setLoading(false);
    this.isLoading = false;
  }

  getPartialSubstanceDetails(uuid: string, type: string): void {
    this.substanceService.getSubstanceDetails(uuid).pipe(take(1)).subscribe(response => {
      if (response) {
        this.substanceClass = response.substanceClass;
        this.status = response.status;
        delete response.uuid;
        if (response._name) {
          delete response._name;
        }
        this.scrub(response, type);
        this.substanceSsg4mService.loadSubstance(response.substanceClass, response).pipe(take(1)).subscribe(() => {
          this.setFormSections(formSections[response.substanceClass]);
          this.loadingService.setLoading(false);
          this.isLoading = false;
        });
      } else {
        this.handleSubstanceRetrivalError();
      }
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
      /* if (!this.definitionType || !(this.definitionType === 'ALTERNATIVE' &&
         (formSection.dynamicComponentName === 'substance-form-names'
           || formSection.dynamicComponentName === 'substance-form-codes-card'))) {
       } */
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
      this.substanceSsg4mService.loadSubstance(this.subClass).pipe(take(1)).subscribe(() => {
        this.setFormSections(formSections.chemical);
        this.loadingService.setLoading(false);
        this.isLoading = false;
      });
    }, 5000);
  }

  validate(validationType?: string): void {
    if (validationType && validationType === 'approval') {
      this.approving = true;
    } else {
      this.approving = false;
    }
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);
    /*
    this.substanceSsg4mService.validateSubstance().pipe(take(1)).subscribe(results => {
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
      if (validationType && validationType === 'approval') {
        this.submissionMessage = 'Are you sure you\'d like to approve this substance?';
      }
    }, error => {
      this.addServerError(error);
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });
    */
  }

  /*
  approve(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.substanceSsg4mService.approveSubstance().pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.openSuccessDialog('approve');
      this.submissionMessage = 'Substance was approved successfully';
      this.showSubmissionMessages = true;
      this.validationResult = false;
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
  */

  validateSubstance(): Observable<ValidationResults> {
    return new Observable(observer => {
      // const substanceCopy = this.cleanSubstance();
      // CHANGING THIS NOW CHANGING THIS NOW
      const substanceCopy = null;
      this.substanceService.validateSubstance(substanceCopy).subscribe(results => {
        // check for missing required reference fields and append a validationMessage
        if (results.validationMessages) {
          for (let i = 0; i < substanceCopy.references.length; i++) {
            const ref = substanceCopy.references[i];
            if (ref.docType !== 'SYSTEM') {
              if ((!ref.citation || ref.citation === '') || (!ref.docType || ref.docType === '')) {
                const invalidReferenceMessage: ValidationMessage = {
                  actionType: 'frontEnd',
                  appliedChange: false,
                  links: [],
                  message: 'All references require a non-empty source type and text/citation value',
                  messageType: 'WARNING',
                  suggestedChange: true
                };
                results.validationMessages.push(invalidReferenceMessage);
                break;
              }
            }
          }
          if (substanceCopy.properties) {
            for (let i = 0; i < substanceCopy.properties.length; i++) {
              const prop = substanceCopy.properties[i];
              if (!prop.propertyType || !prop.name) {
                const invalidPropertyMessage: ValidationMessage = {
                  actionType: 'frontEnd',
                  appliedChange: false,
                  links: [],
                  message: 'Property #' + (i + 1) + ' requires a non-empty name and type',
                  messageType: 'ERROR',
                  suggestedChange: true
                };
                results.validationMessages.push(invalidPropertyMessage);
                results.valid = false;
              }
            }
          }
          if (substanceCopy.relationships) {
            for (let i = 0; i < substanceCopy.relationships.length; i++) {
              const relationship = substanceCopy.relationships[i];
              if (!relationship.relatedSubstance || !relationship.type || relationship.type === '') {
                const invalidRelationshipMessage: ValidationMessage = {
                  actionType: 'frontEnd',
                  appliedChange: false,
                  links: [],
                  message: 'Relationship  #' + (i + 1) + ' requires a non-empty related substance and type',
                  messageType: 'ERROR',
                  suggestedChange: true
                };
                results.validationMessages.push(invalidRelationshipMessage);
                results.valid = false;
              }
            }
          }
          if (substanceCopy.polymer && substanceCopy.polymer.monomers) {
            for (let i = 0; i < substanceCopy.polymer.monomers.length; i++) {
              const prop = substanceCopy.polymer.monomers[i];
              if (!prop.monomerSubstance || prop.monomerSubstance === {}) {
                const invalidPropertyMessage: ValidationMessage = {
                  actionType: 'frontEnd',
                  appliedChange: false,
                  links: [],
                  message: 'Monomer #' + (i + 1) + ' requires a selected substance',
                  messageType: 'ERROR',
                  suggestedChange: true
                };
                results.validationMessages.push(invalidPropertyMessage);
                results.valid = false;
              }
            }
          }
          if (substanceCopy.modifications && substanceCopy.modifications.physicalModifications) {
            for (let i = 0; i < substanceCopy.modifications.physicalModifications.length; i++) {
              const prop = substanceCopy.modifications.physicalModifications[i];
              let present = false;
              prop.parameters.forEach(param => {
                if (param.parameterName) {
                  present = true;
                }
              });

              if (!prop.physicalModificationRole && !present) {
                const invalidPropertyMessage: ValidationMessage = {
                  actionType: 'frontEnd',
                  appliedChange: false,
                  links: [],
                  message: 'Physical Modification #' + (i + 1) + ' requires a modification role or valid parameter',
                  messageType: 'ERROR',
                  suggestedChange: true
                };
                results.validationMessages.push(invalidPropertyMessage);
                results.valid = false;
              }
            }
          }
        }
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  submit(): void {
    this.isLoading = true;
    this.approving = false;
    this.loadingService.setLoading(true);
    this.substanceSsg4mService.saveSubstance().pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.showSubmissionMessages = false;
      this.submissionMessage = '';
      if (!this.id) {
        this.id = response.uuid;
      }
      this.openSuccessDialog();
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

  addServerError(error: any): void {
    this.serverError = true;
    this.validationResult = false;
    this.validationMessages = null;

    const message: ValidationMessage = {
      actionType: 'server failure',
      links: [],
      appliedChange: false,
      suggestedChange: false,
      messageType: 'ERROR',
      message: 'Unknown Server Error'
    };
    if (error && error.error && error.error.message) {
      message.message = 'Server Error ' + (error.status + ': ' || ': ') + error.error.message;
    } else if (error && error.error && (typeof error.error) === 'string') {
      message.message = 'Server Error ' + (error.status + ': ' || '') + error.error;
    } else if (error && error.message) {
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
      if (this.validationMessages[i].messageType !== 'ERROR') {
        this.validationMessages.splice(i, 1);
      }
    }
    if (this.validationMessages.length === 0) {
      this.submissionMessage = 'Substance is Valid. Would you like to submit?';
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.substanceSsg4mService.isSubstanceUpdated) {
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

    const idHolders = defiant.json.search(old, '//*[id]');
    const idMap = {};
    for (let i = 0; i < idHolders.length; i++) {
      const oid = idHolders[i].id;
      if (idMap[oid]) {
        idHolders[i].id = idMap[oid];
      } else {
        const nid = guid();
        idHolders[i].id = nid;
        idMap[oid] = nid;
      }
    }

    const uuidHolders = defiant.json.search(old, '//*[uuid]');
    const _map = {};
    for (let i = 0; i < uuidHolders.length; i++) {
      const ouuid = uuidHolders[i].uuid;
      if (_map[ouuid]) {
        uuidHolders[i].uuid = _map[ouuid];
        if (uuidHolders[i].id) {
          uuidHolders[i].id = _map[ouuid];
        }
      } else {
        const nid = guid();
        uuidHolders[i].uuid = nid;
        _map[ouuid] = nid;
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
        refs[j] = _map[or];
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

    const originHolders = defiant.json.search(old, '//*[originatorUuid]');
    for (let i = 0; i < originHolders.length; i++) {
      const rec = originHolders[i];
      delete rec['originatorUuid'];
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
      old.tags = [];
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
        .filter(function (ref) {
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

  openSuccessDialog(type?: string): void {
    const dialogRef = this.dialog.open(SubmitSuccessDialogComponent, {});
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe((response?: 'continue' | 'browse' | 'view') => {

      this.substanceSsg4mService.bypassUpdateCheck();
      if (response === 'continue') {
        this.router.navigate(['/substances', this.id, 'edit']);
      } else if (response === 'browse') {
        this.router.navigate(['/browse-substance']);
      } else if (response === 'view') {
        this.router.navigate(['/substances', this.id]);
      } else {
        this.submissionMessage = 'Substance was saved successfully!';
        if (type && type === 'approve') {
          this.submissionMessage = 'Substance was approved successfully';
        }
        this.showSubmissionMessages = true;
        this.validationResult = false;
        setTimeout(() => {
          this.showSubmissionMessages = false;
          this.submissionMessage = '';
          this.router.navigate(['/substances', this.id, 'edit']);
        }, 3000);
      }
    });
    this.subscriptions.push(dialogSubscription);

  }

  mergeConcept() {
    this.feature = undefined;
    const dialogRef = this.dialog.open(MergeConceptDialogComponent, {
      width: '900px', data: { uuid: this.id }
    });
    this.overlayContainer.style.zIndex = '1002';
  }

  definitionSwitch() {
    this.feature = undefined;
    const dialogRef = this.dialog.open(DefinitionSwitchDialogComponent, {
      width: '900px', data: { uuid: this.id }, autoFocus: false
    });
    this.overlayContainer.style.zIndex = '1000';
  }

  fixLink(link: string) {
    return this.substanceService.oldLinkFix(link);
  }
}