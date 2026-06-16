import {AfterViewInit, Component, OnInit} from '@angular/core';
import { SubstanceDetail } from '../../substance/substance.model';
import { SubstanceStructure } from '../../substance/substance.model';
import { StructureService } from '../../structure/structure.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { SubstanceCardBase } from '../substance-card-base';
import { UtilsService } from '../../utils/utils.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfigService } from '@gsrs-core/config';

@Component({
    selector: 'app-structure-details',
    templateUrl: './structure-details.component.html',
    styleUrls: ['./structure-details.component.scss'],
    standalone: false
})
export class StructureDetailsComponent extends SubstanceCardBase implements OnInit, AfterViewInit {
  structure: SubstanceStructure;
  showDef = false;
  showSmiles = false;
  defIcon = 'drop_down';
  smilesIcon = 'drop_down';
  nameIcon = 'drop_down';
  inchiKey: string;
  inchi: string;
  showStereo = false;
  molfileHref: any;
  systematic: Array<string>;
  substanceUpdated = new Subject<SubstanceDetail>();
  showNames = false;
  searchHref: string;
  private overlayContainer: HTMLElement;
  rounding = '1.0-2';
  inchiNote = false;

  constructor(
    private utilService: UtilsService,
    private structureService: StructureService,
    public gaService: GoogleAnalyticsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private configService: ConfigService
  ) {
    super();
  }

  ngOnInit() {

      if (this.substance != null) {

        this.getSysNames();
        this.structure = this.substance.structure;
        if(this.substance.$$source && this.substance.$$source === 'staging') {
          this.structure.id = this.substance.uuid;
        }
        if (this.structure.smiles) {
          this.loadInchi(this.structure.molfile);
        }
        this.structure.formula = this.structureService.formatFormula(this.structure);

        const theJSON = this.structure.molfile;
        const uri = this.sanitizer.bypassSecurityTrustUrl('data:text;charset=UTF-8,' + encodeURIComponent(theJSON));
        this.molfileHref = uri;
        this.searchHref = 'structure-search?structure=' + this.structure.id;
      }
      this.overlayContainer = this.overlayContainerService.getContainerElement();
      if (this.configService.configData && this.configService.configData.molWeightRounding) {
          this.rounding = '1.0-' + this.configService.configData.molWeightRounding;
      }

  }



  getSysNames() {
    if ( this.substance && this.substance.names) {
      this.systematic = [];
      this.substance.names.forEach (name => {
        if (name.type === 'sys') {
          this.systematic.push(name.name);
        }
      });
    }
  }

  openModal(templateRef) {

    const dialogRef = this.dialog.open(templateRef, {
      width: '85%',
      height: '85%',
      panelClass: 'structure-image-panel',
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  ngAfterViewInit() {
  this.substanceUpdated.subscribe(substance => {
    this.substance = substance;
    if ( !this.structure || this.structure.id !== this.substance.structure.id ||
      this.structure.molfile !== this.substance.structure.molfile) {
        this.getSysNames();
        if (this.substance.structure.smiles) {
          this.loadInchi(this.substance.structure.molfile);
        }
        this.structure = this.substance.structure;
    const theJSON = this.structure.molfile;
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.molfileHref = uri;
    }

  });
  }

  private loadInchi(molfile: string): void {
    if (!molfile) {
      this.inchi = '';
      this.inchiKey = '';
      this.inchiNote = false;
      return;
    }

    this.structureService.getIdentifiersFromStructure(molfile).pipe(take(1)).subscribe(identifiers => {
      this.inchiKey = identifiers.inchiKey;
      this.inchi = identifiers.inchi;
      if (this.inchi.indexOf('|') > -1) {
        this.inchi = this.inchi.replace(/\|/g, "<br style = 'height:5px;'/>");
        this.inchiNote = true;
      } else {
        this.inchiNote = false;
      }
    });
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


  toggleNames() {
    const value = this.showNames ? 0 : 1;

    this.showNames = !this.showNames;
    if (!this.showNames) {
      this.nameIcon = 'drop_down';
    } else {
      this.nameIcon = 'drop_up';
    }
  }


  toggleSmiles() {

    const value = this.showSmiles ? 0 : 1;
    this.gaService.sendEvent(this.analyticsEventCategory, 'link-toggle', 'smiles', value);

    this.showSmiles = !this.showSmiles;
    if (!this.showSmiles) {
      this.smilesIcon = 'drop_down';
    } else {
      this.smilesIcon = 'drop_up';
    }
  }

  toggleStereo() {
    const value = this.showStereo ? 0 : 1;
    this.gaService.sendEvent(this.analyticsEventCategory, 'link-toggle', 'stereo', value);
    this.showStereo = !this.showStereo;
  }


}
