import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceDetail, SubstanceReference } from '../../substance/substance.model';
import { SubstanceDependenciesImageNode } from './substance-dependencies-image.model';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { StructureService } from '@gsrs-core/structure';
import { ImageFound, ImageFoundSet } from '../../structure/structure-post-response.model';
import { List } from 'lodash';
import { ConfigService } from '@gsrs-core/config/config.service';

@Component({
  selector: 'app-substance-dependencies-image',
  templateUrl: './substance-dependencies-image.component.html',
  styleUrls: ['./substance-dependencies-image.component.scss']
})

export class SubstanceDependenciesImageComponent extends SubstanceCardBaseFilteredList<SubstanceDependenciesImageNode> implements OnInit {
  references: Array<SubstanceReference> = [];
  displayedColumns: string[] = ['relatedSubstance', 'structure', 'relationshipType', 'interactionType', 'mediatorSubtance', 'comments'];
  private overlayContainer: HTMLElement;
  displayImagetag: string;
  dependencies: Array<SubstanceDependenciesImageNode> =[];
  uuid: string;
  imageUrlSet: string[];
  currImage: number = 0;
  substanceClass: string;
  imageType: string;

  constructor(
    private substanceService: SubstanceService,
    private authService: AuthService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private structureService: StructureService,
    public configService: ConfigService,
  ) { super(gaService); }

  ngOnInit() {
    console.log("ngOnInit");
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    this.uuid = this.substance.uuid;
    this.substanceClass= this.substance.substanceClass;

    this.getImageSet(this.uuid);
    this.currImage=0;1
    /*
    this.substanceService.getDependencies(this.uuid).subscribe(response => {
      if (response) {
        this.dependencies = response;
        this.filtered = response;
      }
    }, error => {
    });
    */

    this.getSubstanceRelationships();
  }

  getSubstanceRelationships() {
    let relationship = this.substance.relationships;

    if (relationship.length > 0) {
      this.dependencies = [];
      relationship.forEach(element => {
        if (element != null) {
          if (element.qualification && element.qualification === 'DEPENDENCY') {
            let data: any;
            data = {
              relatedSubstance: element.relatedSubstance,
              relationshipType: element.type,
              interactionType: element.interactionType,
              role: 'Relationship',
              mediatorSubstance: element.mediatorSubstance,
              comments: element.comments
            };
            this.dependencies.push(data);
          }
        }
      });
    }
    this.filtered = this.dependencies;
  }

  openImageModal(uuid: string) {
    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '90%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: { structure: uuid }
    });

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
  }

  getImageSet(uuid: string) {
    this.imageUrlSet = [];
    this.structureService.getImagesList(uuid).subscribe(response => {
      var list: ImageFoundSet = <ImageFoundSet> response;
      console.log(`size of list: ${list.imagesFound.length}`);

      for(var imageNumber = 0; imageNumber < list.imagesFound.length; imageNumber++){
        let imageUrl = `${this.configService.configData.apiBaseUrl}api/v1/substances/${list.imagesFound[imageNumber].url}`;
        this.imageUrlSet.push(imageUrl);
        this.imageType = list.imagesFound[imageNumber].outputType;
      }
    });
  }

  showImage() : boolean {
    return this.imageUrlSet != null && this.imageUrlSet.length > 0;
  }
}
