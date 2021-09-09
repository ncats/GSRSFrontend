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
import { MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-structure-details',
  templateUrl: './structure-details.component.html',
  styleUrls: ['./structure-details.component.scss']
})
export class StructureDetailsComponent extends SubstanceCardBase implements OnInit, AfterViewInit {
  structure: SubstanceStructure;
  showDef = false;
  showSmiles = false;
  defIcon = 'drop_down';
  smilesIcon = 'drop_down';
  nameIcon = 'drop_down';
  inchi: string;
  otherInchi: string;
  showStereo = false;
  molfileHref: any;
  systematic: Array<string>;
  substanceUpdated = new Subject<SubstanceDetail>();
  showNames = false;
  searchHref: string;
  private overlayContainer: HTMLElement;

  constructor(
    private utilService: UtilsService,
    private structureService: StructureService,
    public gaService: GoogleAnalyticsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer
  ) {
    super();
  }

  ngOnInit() {

      if (this.substance != null) {
        this.getSysNames();
        this.structure = this.substance.structure;
        if (this.structure.smiles) {
          this.structureService.getInchi(this.substance.uuid).pipe(take(1)).subscribe(inchi => {
            this.inchi = inchi.replace(/\"/g, '');
          });
          const otherInchiSub = this.structureService.getOtherInchi(this.substance.uuid).pipe(take(1)).subscribe(inchi => {
            this.otherInchi = inchi.replace(/\"/g, '');
          });
        }
        this.structure.formula = this.structureService.formatFormula(this.structure);

        const theJSON = this.structure.molfile;
        const uri = this.sanitizer.bypassSecurityTrustUrl('data:text;charset=UTF-8,' + encodeURIComponent(theJSON));
        this.molfileHref = uri;
        this.searchHref = 'structure-search?structure=' + this.structure.id;
      }
      this.overlayContainer = this.overlayContainerService.getContainerElement();

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
      height: '80%',
      width: '80%'
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
        if (this.structure.smiles) {
          const inchiSub = this.structureService.getInchi(this.substance.uuid).pipe(take(1)).subscribe(inchi => {
            this.inchi = inchi.replace(/\"/g, '');
          });
          const otherInchiSub = this.structureService.getOtherInchi(this.substance.uuid).pipe(take(1)).subscribe(inchi => {
            this.otherInchi = inchi.replace(/\"/g, '');
          });
        }
        this.structure = this.substance.structure;
    const theJSON = this.structure.molfile;
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.molfileHref = uri;
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
