import {AfterViewInit, Component, OnInit} from '@angular/core';
import { SubstanceDetail } from '../../substance/substance.model';
import { SubstanceStructure } from '../../substance/substance.model';
import { StructureService } from '../../structure/structure.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { SubstanceCardBase } from '../substance-card-base';
import { UtilsService } from '../../utils/utils.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';

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
  inchi: string;
  otherInchi: string;
  showStereo = false;
  molfileHref: any;
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor(
    private utilService: UtilsService,
    private structureService: StructureService,
    public gaService: GoogleAnalyticsService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {

      if (this.substance != null) {
        this.structure = this.substance.structure;
        if (this.structure.smiles) {
          this.structureService.getInchi(this.substance.uuid).subscribe(inchi => {
            this.inchi = inchi;
          });
        }
        const theJSON = this.structure.molfile;
        const uri = this.sanitizer.bypassSecurityTrustUrl('data:text;charset=UTF-8,' + encodeURIComponent(theJSON));
        this.molfileHref = uri;
      }

  }

  ngAfterViewInit() {
  this.substanceUpdated.subscribe(substance => {
    this.substance = substance;
    this.structure = this.substance.structure;
    if (this.structure.smiles) {
      console.log('should be getting');
      const inchiSub = this.structureService.getInchi(this.substance.uuid).subscribe(inchi => {
        this.inchi = inchi.replace(/\"/g, '');
      });
      const otherInchiSub = this.structureService.getOtherInchi(this.substance.uuid).subscribe(inchi => {
        this.otherInchi = inchi.replace(/\"/g, '');
      });
    }
    const theJSON = this.structure.molfile;
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.molfileHref = uri;
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
