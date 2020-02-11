import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {SubstanceDetail} from '../../substance/substance.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {AuthService} from '@gsrs-core/auth/auth.service';
import {SubstanceService} from '@gsrs-core/substance/substance.service';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {formSections} from '@gsrs-core/substance-form/form-sections.constant';
import {Subject} from 'rxjs';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-substance-overview',
  templateUrl: './substance-overview.component.html',
  styleUrls: ['./substance-overview.component.scss']
})
export class SubstanceOverviewComponent extends SubstanceCardBase implements OnInit, AfterViewInit {
  references: string[] = [];
  showDef = false;
  downloadJsonHref: any;
  defIcon = 'drop_down';
  latestVersion: number;
  canEdit: boolean;
  versionControl = new FormControl('', Validators.required);
  versions: string[] = [];
  isEditable = false;
  isAdmin = false;
  substanceUpdated = new Subject<SubstanceDetail>();
  oldUrl: string;
  displayStatus: string;
  constructor(
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    public gaService: GoogleAnalyticsService,
    private substanceService: SubstanceService,
    private router: Router,
    private authService: AuthService,
    private cvService: ControlledVocabularyService
  ) {
    super();
  }

  ngOnInit() {
    this.isAdmin = this.authService.hasRoles('admin');
    this.isEditable = (this.authService.hasRoles('updater') || this.authService.hasRoles('superUpdater'))
      && this.substance.substanceClass != null
      && formSections[this.substance.substanceClass.toLowerCase()] != null;
    this.getSubtypeRefs(this.substance);
    const theJSON = JSON.stringify(this.substance);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;
    this.getVersion();
    this.getClassFromCv();
    this.oldUrl = this.substanceService.oldSiteRedirect('details', this.substance.uuid);
    if(this.substance.status === 'approved') {
      this.substance.status = 'Validated (UNII)';
    }
    if(this.substance.status === 'non-approved') {
      this.substance.status = 'non-Validated';
    }
  }

  ngAfterViewInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      this.getVersion();
    });
  }

  getSubtypeRefs(substance: SubstanceDetail): void  {
    if (substance.mixture) {
      this.references = substance.mixture.references;
    } else if (substance.protein) {
      this.references = substance.protein.references;
    } else if (substance.nucleicAcid) {
      this.references = substance.nucleicAcid.references;
    } else if (substance.polymer) {
      this.references = substance.polymer.references;
    } else if (substance.structure) {
      this.references = substance.structure.references;
    } else if (substance.structurallyDiverse) {
      this.references = substance.structurallyDiverse.references;
    }

  }

  getVersion() {
    this.substanceService.checkVersion(this.substance.uuid).subscribe((result: number) => {
      this.versions = [];
      this.latestVersion = result;
      this.setVersionList();
      this.versionControl.setValue(this.substance.version);
    });
  }

  changeVersion() {
    const version = this.versionControl.value.toString();
    this.router.navigate(['/substances/' + this.substance.uuid + '/v/' + version]);
  }

  setVersionList() {
    for (let i = 1; i <= this.latestVersion; i++) {
      this.versions.push(i.toString());
    }
  }

  toggleReferences() {

    const value = this.showDef ? 0 : 1;
    this.gaService.sendEvent(this.analyticsEventCategory, 'link-toggle', 'references', value);
    this.showDef = !this.showDef;
    if (!this.showDef) {
      this.defIcon = 'drop_down';
    } else {
      this.defIcon = 'drop_up';
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 400): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }

  getClassFromCv(): void {
    this.cvService.getDomainVocabulary('SUBSTANCE_CLASS').subscribe(response => {
      const classes = response['SUBSTANCE_CLASS'].list;
      classes.forEach( c => {
        if (c.value === this.substance.substanceClass) {
          this.substance.substanceClass = c.display;
        }
      });
    });
  }


}
