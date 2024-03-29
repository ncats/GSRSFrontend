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
  dependencies: Array<SubstanceDependenciesImageNode>;
  uuid: string;

  constructor(
    private substanceService: SubstanceService,
    private authService: AuthService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog
  ) { super(gaService); }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    this.uuid = this.substance.uuid;

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

}
