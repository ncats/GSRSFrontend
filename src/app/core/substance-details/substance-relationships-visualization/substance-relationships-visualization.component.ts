
import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ConfigService} from '@gsrs-core/config';

@Component({
  selector: 'app-substance-relationships-visualization',
  templateUrl: './substance-relationships-visualization.component.html',
  styleUrls: ['./substance-relationships-visualization.component.scss']
})
export class SubstanceRelationshipsVisualizationComponent extends SubstanceCardBase implements OnInit {
  visualizationUri: SafeResourceUrl;
  displayedVisualizations: number[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private configService: ConfigService,
  ) {
    super();
  }


  ngOnInit() {
    this.visualizationUri = this.sanitizer.bypassSecurityTrustResourceUrl(this.configService.configData.relationshipsVisualizationUri
      + this.substance.uuid.toString());
  }

  openRelationshipsVisualizationWindow() {
    window.open(this.configService.configData.relationshipsVisualizationUri + this.substance.uuid.toString(), '_blank');
  }

  showRelationshipsVisualizationIframe() {
    this.displayedVisualizations = [1];
  }

}