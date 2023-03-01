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
import { ActivatedRoute, Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { SubstanceFormSection } from './substance-form-section';
import { SubstanceFormService } from './substance-form.service';
import { ValidationMessage, SubstanceFormResults, SubstanceFormDefinition } from './substance-form.model';
import { Subscription, Observable } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { JsonDialogComponent } from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import * as _ from 'lodash';
import * as defiant from '../../../../node_modules/defiant.js/dist/defiant.min.js';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@gsrs-core/auth';
import { take, map } from 'rxjs/operators';
import { MatExpansionPanel } from '@angular/material/expansion';
import { SubmitSuccessDialogComponent } from './submit-success-dialog/submit-success-dialog.component';
import {MergeConceptDialogComponent} from '@gsrs-core/substance-form/merge-concept-dialog/merge-concept-dialog.component';
import {DefinitionSwitchDialogComponent} from '@gsrs-core/substance-form/definition-switch-dialog/definition-switch-dialog.component';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { StructuralUnit } from '@gsrs-core/substance';
import { ConfigService } from '@gsrs-core/config';
import { FragmentWizardComponent } from '@gsrs-core/admin/fragment-wizard/fragment-wizard.component';
import { SubstanceDraftsComponent } from '@gsrs-core/substance-form/substance-drafts/substance-drafts.component';
import { UtilsService } from '@gsrs-core/utils';

@Component({
  selector: 'app-substance-form',
  templateUrl: './substance-form.component.html',
  styleUrls: ['./substance-form.component.scss']
})
export class SubstanceFormComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  id?: string;
  formSections: Array< SubstanceFormSection > = [];
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
  validationMessages: Array< ValidationMessage >;
  validationResult = false;
  private subscriptions: Array< Subscription > = [];
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
  drafts: Array<any>;
  draftCount = 0;
  status: string;
  hidePopup: boolean;
  unit: StructuralUnit;
  autoSaveWait = 60000;
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
    'specifiedSubstanceG3'];
    imported = false;
    forceChange = false;
    sameSubstance = false;
    UNII: string;
    approvalType = 'lastEditedBy';
    previousState: number;

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
    private configService: ConfigService,
    private dialog: MatDialog,
    private authService: AuthService,
    private titleService: Title,
    private utilsService: UtilsService
  ) {
    this.substanceService.showImagePopup.subscribe (data => {
      this.hidePopup = data;
    })
    this.substanceService.imagePopupUnit.subscribe (data => {
      this.unit = data;
    })
  }

  showHidePopup(): void {
    this.hidePopup = !this.hidePopup;
    this.substanceService.showImagePopup.next(this.hidePopup);
  }


  autoSave(): void {
    setTimeout(() => {
      if (this.substanceFormService.autoSave()) {
        this.saveDraft(true);
      } else {
      }
      this.autoSave();
    }, this.autoSaveWait);
  }

  openModal(templateRef) {

    const dialogRef = this.dialog.open(templateRef, {
      height: '200px',
      width: '400px'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  showDrafts(): void {
    const dialogRef = this.dialog.open(SubstanceDraftsComponent, {
      maxHeight: '85%',
      width: '70%',
      data: {uuid: this.id}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;


      if (response) {
           this.loadingService.setLoading(true);
         //  console.log(response.json);

          const read = response.substance;
           if (this.id && read.uuid && this.id === read.uuid) {
             this.substanceFormService.importSubstance(read, 'update');
             this.submissionMessage = null;
             this.validationMessages = [];
             this.showSubmissionMessages = false;
             setTimeout(() => {
               this.loadingService.setLoading(false);
               this.isLoading = false;
               this.overlayContainer.style.zIndex = null;
             }, 1000);
           }else if (response.uuid && response.uuid != 'register'){
             const url = '/substances/' + response.uuid + '/edit?action=import&source=draft';
            this.router.navigateByUrl(url, { state: { record: response.substance } });
           } else {
             setTimeout(() => {
               this.overlayContainer.style.zIndex = null;
               this.router.onSameUrlNavigation = 'reload';
               this.loadingService.setLoading(false);
               this.router.onSameUrlNavigation = 'reload';
              this.router.navigateByUrl('/substances/register/' + response.substance.substanceClass + '?action=import', { state: { record: response.substance } });
   
             }, 1000);
           }
          }

          let keys = Object.keys(localStorage);
          let i = keys.length;
          this.draftCount =0;
          this.drafts = [];

          while ( i-- ) {
            if (keys[i].startsWith('gsrs-draft-')){
              const entry = JSON.parse(localStorage.getItem(keys[i]));
              entry.key = keys[i];
              if (this.id && entry.uuid === this.id) {
                this.draftCount++;
              } else if (!this.id && entry.type ===  (this.activatedRoute.snapshot.params['type']) && entry.uuid === 'register') {
                this.draftCount++;
              }
              this.drafts.push( entry );

            }
          }
    });
  }
  

  importDialog(): void {
    const dialogRef = this.dialog.open(SubstanceEditImportDialogComponent, {
      width: '650px',
      autoFocus: false

    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      if (response) {
     //   this.overlayContainer.style.zIndex = null;
        this.loadingService.setLoading(true);

        // attempting to reload a substance without a router refresh has proven to cause issues with the relationship dropdowns
        // There are probably other components affected. There is an issue with subscriptions likely due to some OnInit not firing

       const read = JSON.parse(response);
        if (this.id && read.uuid && this.id === read.uuid) {
          this.substanceFormService.importSubstance(read, 'update');
          this.submissionMessage = null;
          this.validationMessages = [];
          this.showSubmissionMessages = false;
          setTimeout(() => {
            this.loadingService.setLoading(false);
            this.isLoading = false;
            this.overlayContainer.style.zIndex = null;
          }, 1000);
      /*   } else {
        if ( read.substanceClass === this.substanceClass) {
          this.imported = true;
          this.substanceFormService.importSubstance(read);
          this.submissionMessage = null;
          this.validationMessages = [];
          this.showSubmissionMessages = false;
          this.loadingService.setLoading(false);
          this.isLoading = false;*/
        } else {
          setTimeout(() => {
            this.overlayContainer.style.zIndex = null;
            this.router.onSameUrlNavigation = 'reload';
            this.loadingService.setLoading(false);
           this.router.navigateByUrl('/substances/register?action=import', { state: { record: response } });

          }, 1000);
        }
       }
     // }
    });

  }

  test() {
    this.router.navigated = false;
        this.router.navigate([this.router.url]);
  }

  ngOnInit() {
    this.loadingService.setLoading(true);
    if (this.configService.configData && this.configService.configData.approvalType) {
      this.approvalType = this.configService.configData.approvalType;
    }
    if (this.configService.configData && this.configService.configData.autoSaveWait) {
      this.autoSaveWait = this.configService.configData.autoSaveWait;
    }
    this.isAdmin = this.authService.hasRoles('admin');
    this.isUpdater = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.imported = false;
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        
        const action = this.activatedRoute.snapshot.queryParams['action'] || null;
      
        if (params['id']) {
          
          if(action && action === 'import' && window.history.state) {
            const record = window.history.state;
            this.imported = true;
            
            this.getDetailsFromImport(record.record);
          } else {
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
          }
        } else {
          if (action && action === 'import' && window.history.state) {
            const record = window.history.state;
            this.imported = true;
            this.getDetailsFromImport(record.record);
            this.gaService.sendPageView(`Substance Register`);

          } else if (this.activatedRoute.snapshot.queryParams['stagingID']) {
            this.substanceService.GetStagedRecord(this.activatedRoute.snapshot.queryParams['stagingID']).subscribe(response => {
              response.uuid = null;


                if (response._name){
                  let name = response._name;
                  response.names.forEach(current => {
                    if (current.displayName && current.stdName) {
                      name = current.stdName;
                    }
                  });
                  name = name.replace(/<[^>]*>?/gm, '');
                  this.titleService.setTitle('Edit - ' + name);
                }
                if (response) {
                  this.definitionType = response.definitionType;
                  this.substanceClass = response.substanceClass;
                  this.status = response.status;
                  this.substanceFormService.loadSubstance(response.substanceClass, response).pipe(take(1)).subscribe(() => {
                    this.setFormSections(formSections[response.substanceClass]);
                  });
                
              }
            }, error => {
              let response = this.setDemo();
              response.uuid = null;
              if (response._name){
                let name = response._name;
                response.names.forEach(current => {
                  if (current.displayName && current.stdName) {
                    name = current.stdName;
                  }
                });
                name = name.replace(/<[^>]*>?/gm, '');
                this.titleService.setTitle('Edit - ' + name);
              }
              if (response) {
                this.definitionType = response.definitionType;
                this.substanceClass = response.substanceClass;
                this.status = response.status;
                this.substanceFormService.loadSubstance(response.substanceClass, response).pipe(take(1)).subscribe(() => {
                  this.setFormSections(formSections[response.substanceClass]);
                });
              
            }
            });      
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
              this.substanceClass = this.subClass;
              this.titleService.setTitle('Register - ' + this.subClass);
              this.substanceFormService.loadSubstance(this.subClass).pipe(take(1)).subscribe(() => {
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
        this.substanceFormService.unloadSubstance();
      }
    });
    this.subscriptions.push(routerSubscription);
    this.approving = false;
    const definitionSubscription = this.substanceFormService.definition.subscribe(response => {
      this.definition = response;
      setTimeout(() => {
        this.canApprove = this.canBeApproved();
      });
    });
    this.subscriptions.push(definitionSubscription);
    this.authService.getAuth().pipe(take(1)).subscribe(auth => {
      this.user = auth.identifier;
      setTimeout(() => {
        this.canApprove = this.canBeApproved();

      });
    });

  }

getDrafts() {
  let keys = Object.keys(localStorage);
    let i = keys.length;
    this.drafts = [];
    let temp = 0;
    while ( i-- ) {
      if (keys[i].startsWith('gsrs-draft-')){
        const entry = JSON.parse(localStorage.getItem(keys[i]));
        entry.key = keys[i];
        if (this.id && entry.uuid === this.id) {
          temp++;
         // this.draftCount++;
        } else if (!this.id && entry.type === (this.activatedRoute.snapshot.params['type']) && entry.uuid === 'register') {
          temp++;
        //  this.draftCount++;
        }
        this.drafts.push( entry );

      }
    }
    this.draftCount = temp;
}

  ngAfterViewInit(): void {
    this.getDrafts();
    

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
              this.UNII = this.substanceFormService.getUNII();
            }, 5);
            });
        });
       // this.loadingService.setLoading(false);

      }
        subscription.unsubscribe();
        setTimeout(() => {

        this.autoSave();},10000);

      });
  }

  openedChange(event: any) {
    if (event) {
      this.overlayContainer.style.zIndex = '1002';
    } else {
      this.overlayContainer.style.zIndex = '1000';
    }
  }

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
    if (this.feature === 'fragment') {
      this.openFragmentDialog();
    }

    

  }

  openFragmentDialog(): void {
    const dialogRef = this.dialog.open(FragmentWizardComponent, {
      width: '70%',
      height: '70%'
    });
    this.overlayContainer.style.zIndex = '50';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {

    });
    this.subscriptions.push(dialogSubscription);
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
    // if config var set and set to 'createdBy then set approval button enabled if user is not creator
    if(this.approvalType === 'createdBy') {
        if (this.definition && this.definition.createdBy && this.user) {
          const creator = this.definition.createdBy;
          if (!creator) {
            return false;
          }
          if (this.definition.status === 'approved') {
            return false;
          }
          if (creator === this.user) {
            return false;
          }
          return true;
    
        }
        return false;
        //default to 'lastEditedBy' if not set in config
      } else {
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
    }
    
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
      if (response._name){
        let name = response._name;
        response.names.forEach(current => {
          if (current.displayName && current.stdName) {
            name = current.stdName;
          }
        });
        name = name.replace(/<[^>]*>?/gm, '');
        this.titleService.setTitle('Edit - ' + name);
      }
      if (response) {
        this.definitionType = response.definitionType;
        if (newType) {
          response = this.substanceFormService.switchType(response, newType);
        }
        this.substanceClass = response.substanceClass;
        this.status = response.status;
        this.substanceFormService.loadSubstance(response.substanceClass, response).pipe(take(1)).subscribe(() => {
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
    if(!this.jsonValid(state)) {
      state  = JSON.stringify(state);
    }
    if (state && this.jsonValid(state)) {
      const response = JSON.parse(state);
      same = false;
      this.definitionType = response.definitionType;
      this.substanceClass = response.substanceClass;
      this.status = response.status;
      this.substanceFormService.loadSubstance(response.substanceClass, response, 'import').pipe(take(1)).subscribe(() => {
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
        this.substanceFormService.loadSubstance(response.substanceClass, response).pipe(take(1)).subscribe(() => {
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
      this.substanceFormService.loadSubstance(this.subClass).pipe(take(1)).subscribe(() => {
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
    this.substanceFormService.validateSubstance().pipe(take(1)).subscribe(results => {
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
  }

  approve(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.substanceFormService.approveSubstance().pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.openSuccessDialog({ type: 'approve' });
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

  submit(): void {
    this.isLoading = true;
    this.approving = false;
    this.loadingService.setLoading(true);
    this.substanceFormService.saveSubstance().pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.showSubmissionMessages = false;
      this.submissionMessage = '';
      if (!this.id) {
        this.id = response.uuid;
      }
      this.openSuccessDialog({ type: 'submit', fileUrl: response.fileUrl });
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
    let remove = ['BDNUM'];
    if (this.configService.configData && this.configService.configData.filteredDuplicationCodes) {
      remove = this.configService.configData.filteredDuplicationCodes;
    }
      remove.forEach(code => {
        _.remove(old.codes, {
          codeSystem: code
        });
      })
    
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

  openSuccessDialog({ type, fileUrl }: { type?: 'submit'|'approve', fileUrl?: string }): void {
    const dialogRef = this.dialog.open(SubmitSuccessDialogComponent, {
      data: {
        type: type,
        fileUrl: fileUrl
      },
      disableClose: true
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe((response?: 'continue' | 'browse' | 'view') => {

      this.substanceFormService.bypassUpdateCheck();
      if (response === 'continue') {
        this.router.navigate(['/substances', this.id, 'edit']);
      } else if (response === 'browse') {
        this.router.navigate(['/browse-substance']);
      } else if (response === 'view') {
        this.router.navigate(['/substances', this.id]);
      } else if (response === 'viewInPfda') {
        // View the submitted substance file in the user's precisionFDA home
        window.location.assign(fileUrl);
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
    width: '900px', data: {uuid: this.id}
  });
  this.overlayContainer.style.zIndex = '1002';
}

  definitionSwitch() {
    this.feature = undefined;
    const dialogRef = this.dialog.open(DefinitionSwitchDialogComponent, {
      width: '900px', data: {uuid: this.id}, autoFocus: false
    });
    this.overlayContainer.style.zIndex = '1000';
  }

  fixLink(link: string) {
    return this.substanceService.oldLinkFix(link);
  }


  saveDraft(auto?: boolean) {
    const json = this.substanceFormService.cleanSubstance();
    const time = new Date().getTime();
    
    const uuid = json.uuid ? json.uuid : 'register';
    const type = json.substanceClass;
    let primary = null;
    json.names.forEach(name => {
      if (name.displayName) {
        primary = name.name;
      }
    });
    if (!primary && json.names.length > 0) {
      primary = json.names[0].name;
    }
    if(!auto) {
      const file = 'gsrs-draft-' + time;

      let draft = {
        'uuid': uuid,
        'date': time,
        'type': type,
        'name': primary,
        'substance': json,
        'auto': false,
        'file': file
      }
  
     localStorage.setItem(file, JSON.stringify(draft));
     this.draftCount++;

    } else {
      this.getDrafts();
      let autos = this.drafts.filter(opt => {
        return opt.auto;
      });
      let auto1 = null;
      let auto2 = null;
      let auto3 = null;
      this.drafts.forEach(draft => {
        if (draft.auto) {
          if (draft.file === 'gsrs-draft-auto1') {
            auto1 = draft;
          }
          if (draft.file === 'gsrs-draft-auto2') {
            auto2 = draft;
          }
          if (draft.file === 'gsrs-draft-auto3') {
            auto3 = draft;
          }
        }
      });
      let file = 'gsrs-draft-auto';

      if (!auto1) {
         file = 'gsrs-draft-auto1';
        this.draftCount++;

      } else if (!auto2) {
         file = 'gsrs-draft-auto2';
        this.draftCount++;

      } else if (!auto3) {
         file = 'gsrs-draft-auto3';
        this.draftCount++;

      } else {
          if(auto1.date < auto2.date && auto1.date < auto3.date) {
             file = 'gsrs-draft-auto1';
        }
        else if (auto2.date < auto1.date && auto2.date < auto3.date) {
           file = 'gsrs-draft-auto2';
        }
        else {
           file = 'gsrs-draft-auto3';
        }
      }

      let draft = {
        'uuid': uuid,
        'date': time,
        'type': type,
        'name': primary,
        'substance': json,
        'auto': true,
        'file': file
      }

     localStorage.setItem(file, JSON.stringify(draft));

      
    }
    

    

  }

  setDemo() {
    return {
      "deprecated": false,
      "uuid": "eb17b78c-1e4b-4dca-bdef-6d64a0013aec",
      "definitionType": "PRIMARY",
      "definitionLevel": "COMPLETE",
      "substanceClass": "chemical",
      "status": "pending",
      "version": "1",
      "names": [
        {
          "deprecated": false,
          "uuid": "3204c8dc-8bc4-487e-8d74-91a2f5d49fb7",
          "name": "EINECS 245-123-2",
          "stdName": "EINECS 245-123-2",
          "type": "cn",
          "domains": [],
          "languages": [
            "en"
          ],
          "nameJurisdiction": [],
          "nameOrgs": [],
          "preferred": false,
          "displayName": true,
          "references": [
            "8b47627f-e78e-46ea-9d27-7cdfb80bb391"
          ],
          "access": []
        }
      ],
      "codes": [
        {
          "deprecated": false,
          "codeSystem": "CAS",
          "code": "22615-60-7",
          "type": "PRIMARY",
          "_isClassification": false,
          "references": [
            "7a8afac4-4448-4d8f-babe-cef3a85d5f2a"
          ],
          "access": []
        }
      ],
      "notes": [
        {
          "deprecated": false,
          "note": "[Validation]WARNING:Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
          "references": [
            "58e0915e-137d-48cc-997d-248474c8830b"
          ],
          "access": [
            "admin"
          ]
        }
      ],
      "properties": [],
      "relationships": [],
      "references": [
        {
          "deprecated": false,
          "uuid": "7a8afac4-4448-4d8f-babe-cef3a85d5f2a",
          "citation": "System generated",
          "docType": "SYSTEM",
          "publicDomain": true,
          "tags": [
            "PUBLIC_DOMAIN_RELEASE"
          ],
          "access": []
        },
        {
          "deprecated": false,
          "uuid": "8b47627f-e78e-46ea-9d27-7cdfb80bb391",
          "citation": "File null imported on Tue Feb 21 13:33:01 EST 2023",
          "docType": "CATALOG",
          "publicDomain": true,
          "tags": [],
          "access": []
        },
        {
          "deprecated": false,
          "uuid": "58e0915e-137d-48cc-997d-248474c8830b",
          "citation": "GSRS System-generated Validation messages",
          "docType": "VALIDATION_MESSAGE",
          "documentDate": 1677004382385,
          "publicDomain": false,
          "tags": [],
          "access": [
            "admin"
          ]
        }
      ],
      "tags": [],
      "structure": {
        "deprecated": false,
        "digest": "22dbfd7e56a5f5b642d9fb10746cee508e278dd7",
        "molfile": "\n  CDK     02212313332D\n\n 10  7  0  0  0  0  0  0  0  0999 V2000\n    2.3750   -3.7292    0.0000 Ru  0  2  0  0  0  0  0  0  0  0  0  0\n    1.6708   -3.7292    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    3.5542   -3.7125    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2708   -3.7125    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8958   -2.9875    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8917   -4.4958    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7125   -4.5250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8708   -2.8833    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.5375   -3.8875    0.0000 Cl  0  5  0  0  0  0  0  0  0  0  0  0\n   -0.6125   -3.7958    0.0000 Cl  0  5  0  0  0  0  0  0  0  0  0  0\n  1  5  1  0  0  0  0\n  1  2  1  0  0  0  0\n  1  6  1  0  0  0  0\n  1  7  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  8  1  0  0  0  0\n  3  4  2  0  0  0  0\nM  CHG  1   1   2\nM  CHG  1   9  -1\nM  CHG  1  10  -1\nM  END",
        "smiles": "[Cl-].[Cl-].[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
        "formula": "2Cl.ClH<sub>8</sub>N<sub>5</sub>ORu",
        "opticalActivity": "NONE",
        "atropisomerism": "No",
        "stereoCenters": 0,
        "definedStereo": 0,
        "ezCenters": 0,
        "charge": 0,
        "mwt": 301.5202,
        "properties": [
          {
            "label": "SMILES",
            "text": "[Cl-].[Cl-].[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]"
          },
          {
            "label": "InChI_Key",
            "term": "MYPLXICLEQNWLS_UHFFFAOYSA_K"
          },
          {
            "label": "EXACT_HASH",
            "term": "MYPLXICLEQNWLS_UHFFFAOYSA_K"
          },
          {
            "label": "STEREO_INSENSITIVE_HASH",
            "term": "MYPLXICLEQNWLS"
          }
        ],
        "links": [],
        "count": 1,
        "stereochemistry": "ACHIRAL",
        "stereoChemistry": "ACHIRAL",
        "access": [],
        "references": [
          "8b47627f-e78e-46ea-9d27-7cdfb80bb391"
        ],
        "hash": "MYPLXICLEQNWLS_UHFFFAOYSA_K"
      },
      "moieties": [
        {
          "deprecated": false,
          "digest": "d0c87fddbea1426d6f72954f3472043800d74085",
          "molfile": "\n  CDK     02212313332D\n\n  8  7  0  0  0  0  0  0  0  0999 V2000\n    2.3750   -3.7292    0.0000 Ru  0  2  0  0  0  0  0  0  0  0  0  0\n    1.6708   -3.7292    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    3.5542   -3.7125    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2708   -3.7125    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8958   -2.9875    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8917   -4.4958    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7125   -4.5250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8708   -2.8833    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  5  1  0  0  0  0\n  1  2  1  0  0  0  0\n  1  6  1  0  0  0  0\n  1  7  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  8  1  0  0  0  0\n  3  4  2  0  0  0  0\nM  CHG  1   1   2\nM  END",
          "smiles": "[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
          "formula": "ClH8N5ORu",
          "opticalActivity": "NONE",
          "atropisomerism": "No",
          "stereoCenters": 0,
          "definedStereo": 0,
          "ezCenters": 0,
          "charge": 2,
          "mwt": 230.6143,
          "properties": [
            {
              "label": "SMILES",
              "text": "[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]"
            },
            {
              "label": "InChI_Key",
              "term": "YRVVILPTLZEWRT_UHFFFAOYSA_M"
            },
            {
              "label": "EXACT_HASH",
              "term": "YRVVILPTLZEWRT_UHFFFAOYSA_M"
            },
            {
              "label": "STEREO_INSENSITIVE_HASH",
              "term": "YRVVILPTLZEWRT"
            }
          ],
          "links": [],
          "count": 1,
          "stereochemistry": "ACHIRAL",
          "stereoChemistry": "ACHIRAL",
          "access": [],
          "references": [],
          "hash": "YRVVILPTLZEWRT_UHFFFAOYSA_M",
          "countAmount": {
            "deprecated": false,
            "type": "MOL RATIO",
            "average": 1,
            "units": "MOL RATIO",
            "references": [],
            "access": []
          }
        },
        {
          "deprecated": false,
          "digest": "d542d8767d587637cd9c5293fb6d3c5b0b8911b2",
          "molfile": "\n  CDK     02212313332D\n\n  1  0  0  0  0  0  0  0  0  0999 V2000\n    5.5375   -3.8875    0.0000 Cl  0  5  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1  -1\nM  END",
          "smiles": "[Cl-]",
          "formula": "Cl",
          "opticalActivity": "NONE",
          "atropisomerism": "No",
          "stereoCenters": 0,
          "definedStereo": 0,
          "ezCenters": 0,
          "charge": -1,
          "mwt": 35.4529,
          "properties": [
            {
              "label": "SMILES",
              "text": "[Cl-]"
            },
            {
              "label": "InChI_Key",
              "term": "VEXZGXHMUGYJMC_UHFFFAOYSA_M"
            },
            {
              "label": "EXACT_HASH",
              "term": "VEXZGXHMUGYJMC_UHFFFAOYSA_M"
            },
            {
              "label": "STEREO_INSENSITIVE_HASH",
              "term": "VEXZGXHMUGYJMC"
            }
          ],
          "links": [],
          "count": 2,
          "stereochemistry": "ACHIRAL",
          "stereoChemistry": "ACHIRAL",
          "access": [],
          "references": [],
          "hash": "VEXZGXHMUGYJMC_UHFFFAOYSA_M",
          "countAmount": {
            "deprecated": false,
            "type": "MOL RATIO",
            "average": 2,
            "units": "MOL RATIO",
            "references": [],
            "access": []
          }
        }
      ],
      "_name": "EINECS 245-123-2",
      "_approvalIDDisplay": "pending record",
      "access": [],
      "_metadata": {
        "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
        "recordId": "8669cf29-b311-456d-a172-96151a031f52",
        "version": 1,
        "sourceName": "nlm_2 part 22m.sdf",
        "versionCreationDate": 1677004381837,
        "importStatus": "merged",
        "importType": "create",
        "versionStatus": "current",
        "validationStatus": "warning",
        "processStatus": "loaded",
        "entityClassName": "ix.ginas.models.v1.Substance",
        "keyValueMappings": [
          {
            "mappingId": "79df508c-121d-45f0-b7c3-457c8dfbcbdc",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "CAS NUMBER",
            "value": "22615-60-7",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "fafde51e-3b6a-4a7b-acd1-9df0d5187c76",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Substance Name",
            "value": "EINECS 245-123-2",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "93e91be3-c924-4867-bac8-af576062fe0c",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Primary Name",
            "value": "EINECS 245-123-2",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "1c4ffb1a-f4d9-4175-8946-4ca1469e32a8",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Definitional Hash - Layer 1",
            "value": "e4530fce3e163ba464763e873f6df801188284f5",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "f1ce2517-99da-48ca-a6b6-8e0a0efe0098",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Definitional Hash - Layer 2",
            "value": "fd8d4dcba08581303eed2c2ca9dc1d81cfcee0e4",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "3dfd49bb-5037-462b-8c17-98841428994d",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "CODE",
            "value": "22615-60-7",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "3fe53378-16a5-47ab-9fbf-2dceda290945",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "UUID",
            "value": "eb17b78c-1e4b-4dca-bdef-6d64a0013aec",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          }
        ],
        "validations": [
          {
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "version": 1,
            "validationDate": 1677004382386,
            "validationMessage": "Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
            "validationJson": "ValidationResponse{validationMessages=[INFO: No moieties found in submission. They will be generated automatically., WARNING: Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]], valid=true, newObject=Substance{uuid=eb17b78c-1e4b-4dca-bdef-6d64a0013aec, substanceClass=chemical, version='1'}}",
            "validationType": "warning",
            "validationId": "72bd0cbc-12a0-46a0-9718-b7971bad0491"
          },
          {
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "version": 1,
            "validationDate": 1677004382389,
            "validationMessage": "No moieties found in submission. They will be generated automatically.",
            "validationJson": "ValidationResponse{validationMessages=[INFO: No moieties found in submission. They will be generated automatically., WARNING: Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]], valid=true, newObject=Substance{uuid=eb17b78c-1e4b-4dca-bdef-6d64a0013aec, substanceClass=chemical, version='1'}}",
            "validationType": "info",
            "validationId": "afebceda-e15a-4a9a-a270-7b3787e58678"
          }
        ],
        "dataFormat": "application/octet-stream",
        "importAdapter": "SDF Adapter",
        "access": []
      },
      "_matches": {
        "query": [
          {
            "key": "CAS NUMBER",
            "value": "22615-60-7",
            "qualifier": "CAS",
            "layer": 1
          },
          {
            "key": "Substance Name",
            "value": "EINECS 245-123-2",
            "qualifier": "name type: cn",
            "layer": 1
          },
          {
            "key": "Primary Name",
            "value": "EINECS 245-123-2",
            "qualifier": "Display Name",
            "layer": 0
          },
          {
            "key": "Definitional Hash - Layer 1",
            "value": "801bdccb80fe39f42eb7ec2ba029adb91bd76479",
            "layer": 1
          },
          {
            "key": "Definitional Hash - Layer 2",
            "value": "142616304821caf525b137f43414aad6f61e58c3",
            "layer": 2
          },
          {
            "key": "CODE",
            "value": "22615-60-7",
            "qualifier": "Code system: CAS; type: PRIMARY",
            "layer": 0
          }
        ],
        "matches": [
          {
            "tupleUsedInMatching": {
              "key": "CAS NUMBER",
              "value": "22615-60-7",
              "qualifier": "CAS",
              "layer": 1
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "4673c329-569b-4068-8700-d661376a454d"
                },
                "sourceName": "GSRS",
                "matchedKey": "CAS NUMBER"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "3924bf03-1013-4cb0-8fb5-494219e136e4"
                },
                "sourceName": "GSRS",
                "matchedKey": "CAS NUMBER"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "8669cf29-b311-456d-a172-96151a031f52"
                },
                "sourceName": "Staging Area",
                "matchedKey": "CAS NUMBER"
              }
            ]
          },
          {
            "tupleUsedInMatching": {
              "key": "Substance Name",
              "value": "EINECS 245-123-2",
              "qualifier": "name type: cn",
              "layer": 1
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "90e9191d-1a81-4a53-b7ee-560bf9e68109"
                },
                "sourceName": "GSRS",
                "matchedKey": "Substance Name"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "90e9191d-1a81-4a53-b7ee-560bf9e68109"
                },
                "sourceName": "GSRS",
                "matchedKey": "Substance Name"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "8669cf29-b311-456d-a172-96151a031f52"
                },
                "sourceName": "Staging Area",
                "matchedKey": "Substance Name"
              }
            ]
          },
          {
            "tupleUsedInMatching": {
              "key": "Primary Name",
              "value": "EINECS 245-123-2",
              "qualifier": "Display Name",
              "layer": 0
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "90e9191d-1a81-4a53-b7ee-560bf9e68109"
                },
                "sourceName": "GSRS",
                "matchedKey": "Primary Name"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "90e9191d-1a81-4a53-b7ee-560bf9e68109"
                },
                "sourceName": "Staging Area",
                "matchedKey": "Primary Name"
              }
            ]
          },
          {
            "tupleUsedInMatching": {
              "key": "Definitional Hash - Layer 1",
              "value": "801bdccb80fe39f42eb7ec2ba029adb91bd76479",
              "layer": 1
            },
            "matchingRecords": []
          },
          {
            "tupleUsedInMatching": {
              "key": "Definitional Hash - Layer 2",
              "value": "142616304821caf525b137f43414aad6f61e58c3",
              "layer": 2
            },
            "matchingRecords": []
          },
          {
            "tupleUsedInMatching": {
              "key": "CODE",
              "value": "22615-60-7",
              "qualifier": "Code system: CAS; type: PRIMARY",
              "layer": 0
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "4673c329-569b-4068-8700-d661376a454d"
                },
                "sourceName": "GSRS",
                "matchedKey": "CODE"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "3924bf03-1013-4cb0-8fb5-494219e136e4"
                },
                "sourceName": "GSRS",
                "matchedKey": "CODE"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "8669cf29-b311-456d-a172-96151a031f52"
                },
                "sourceName": "Staging Area",
                "matchedKey": "CODE"
              }
            ]
          }
        ],
        "multiplyMatchedKeys": [],
        "uniqueMatchingKeys": [
          "CAS NUMBER",
          "Substance Name",
          "Primary Name",
          "Definitional Hash - Layer 1",
          "Definitional Hash - Layer 2",
          "CODE"
        ]
      },
      "matchedRecords": [
        {
          "ID": "4673c329-569b-4068-8700-d661376a454d",
          "records": [
            "CAS NUMBER",
            "CODE"
          ]
        },
        {
          "ID": "3924bf03-1013-4cb0-8fb5-494219e136e4",
          "records": [
            "CAS NUMBER",
            "CODE"
          ]
        },
        {
          "ID": "8669cf29-b311-456d-a172-96151a031f52",
          "records": [
            "CAS NUMBER",
            "Substance Name",
            "CODE"
          ]
        },
        {
          "ID": "90e9191d-1a81-4a53-b7ee-560bf9e68109",
          "records": [
            "Substance Name",
            "Substance Name",
            "Primary Name",
            "Primary Name"
          ],
          "_name": "SODIUM <b>GLUCONATE</b>"
        }
      ],
      "validations": {
        "warnings": 1,
        "errors": 0,
        "validations": [
          {
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "version": 1,
            "validationDate": 1677004382386,
            "validationMessage": "Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
            "validationJson": "ValidationResponse{validationMessages=[INFO: No moieties found in submission. They will be generated automatically., WARNING: Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]], valid=true, newObject=Substance{uuid=eb17b78c-1e4b-4dca-bdef-6d64a0013aec, substanceClass=chemical, version='1'}}",
            "validationType": "warning",
            "validationId": "72bd0cbc-12a0-46a0-9718-b7971bad0491"
          },
          {
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "version": 1,
            "validationDate": 1677004382389,
            "validationMessage": "No moieties found in submission. They will be generated automatically.",
            "validationJson": "ValidationResponse{validationMessages=[INFO: No moieties found in submission. They will be generated automatically., WARNING: Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]], valid=true, newObject=Substance{uuid=eb17b78c-1e4b-4dca-bdef-6d64a0013aec, substanceClass=chemical, version='1'}}",
            "validationType": "info",
            "validationId": "afebceda-e15a-4a9a-a270-7b3787e58678"
          }
        ]
      }
    };
  }
}
