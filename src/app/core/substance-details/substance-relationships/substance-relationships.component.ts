import { Component, OnInit } from '@angular/core';
import { SubstanceRelationship } from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import { UtilsService } from '../../utils/utils.service';
import { ConfigService } from '../../config/config.service';
import { MatDialog } from '@angular/material';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';

@Component({
  selector: 'app-substance-relationships',
  templateUrl: './substance-relationships.component.html',
  styleUrls: ['./substance-relationships.component.scss']
})
export class SubstanceRelationshipsComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship> implements OnInit {
  type: string;
  relationships: Array<SubstanceRelationship> = [];
  displayedColumns = ['relatedRecord', 'mediatorRecord', 'type', 'details', 'references'];
  private excludedRelationships: Array<string>;

  constructor(
    private utilService: UtilsService,
    private configService: ConfigService,
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    if (this.type === 'RELATIONSHIPS'
      && this.configService.configData
      && this.configService.configData.substanceDetailsCards
      && this.configService.configData.substanceDetailsCards.length
    ) {
      const relationshipsCard = this.configService.configData.substanceDetailsCards.find(card => card.type === this.type);
      if (relationshipsCard != null && relationshipsCard.filters && relationshipsCard.filters.length) {
        const filter = relationshipsCard.filters.find(_filter => _filter.filterName === 'substanceRelationships') || { value: [] };
        this.excludedRelationships = filter.value;
      }
    }

    if (this.substance != null && this.type != null) {
      this.filterRelationhships();
      this.countUpdate.emit(this.relationships.length);
      this.filtered = this.relationships;
      this.pageChange();
      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.relationships, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
    }

  }

  private filterRelationhships(): void {
    if (this.substance.relationships && this.substance.relationships.length > 0) {
      this.substance.relationships.forEach(relationship => {
        const typeParts = relationship.type.split('->');
        const property = typeParts && typeParts.length && typeParts[0].trim() || '';
        if (this.excludedRelationships != null && this.excludedRelationships instanceof Array) {
          let isInExcludedValues = false;
          this.excludedRelationships.forEach(value => {
            if (property.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              isInExcludedValues = true;
            }
          });
          if (!isInExcludedValues) {
            this.relationships.push(relationship);
          }
        } else if (property.toLowerCase().indexOf(this.type.toLowerCase()) > -1) {
          this.relationships.push(relationship);
        }
      });
      console.log(this.relationships);
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilService.getSafeStructureImgUrl(structureId, size);
  }

  openModal(templateRef) {

    this.gaService.sendEvent(this.analyticsEventCategory, 'button', 'references view');

    const dialogRef = this.dialog.open(templateRef, {});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
