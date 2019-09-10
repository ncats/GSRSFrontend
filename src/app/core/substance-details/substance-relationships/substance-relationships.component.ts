import { Component, OnInit } from '@angular/core';
import {SubstanceDetail, SubstanceRelationship} from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import { UtilsService } from '../../utils/utils.service';
import { ConfigService } from '../../config/config.service';
import { MatDialog } from '@angular/material';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import {Sort} from '@angular/material';

@Component({
  selector: 'app-substance-relationships',
  templateUrl: './substance-relationships.component.html',
  styleUrls: ['./substance-relationships.component.scss']
})
export class SubstanceRelationshipsComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship> implements OnInit {
  type: string;
  relationships: Array<SubstanceRelationship> = [];
  displayedColumns = ['relatedRecord', 'type', 'details', 'references'];
  private excludedRelationships: Array<string>;
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;

  constructor(
    private utilService: UtilsService,
    private configService: ConfigService,
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.relationships = [];
      this.substance = substance;
      if (this.type === 'RELATIONSHIPS'
        && this.configService.configData
        && this.configService.configData.substanceDetailsCards
        && this.configService.configData.substanceDetailsCards.length
      ) {
        const relationshipsCard = this.configService.configData.substanceDetailsCards.find(card => card.type === this.type);
        if (relationshipsCard != null && relationshipsCard.filters && relationshipsCard.filters.length) {
          const filter = relationshipsCard.filters.find(_filter => _filter.filterName === 'substanceRelationships') || {value: []};
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
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }
  sortData(sort: Sort) {
    const data = this.relationships.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      this.pageChange();
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'relatedRecord': return compare(a.relatedSubstance.name.toUpperCase(), b.relatedSubstance.name.toUpperCase(), isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        default: return 0;
      }
    });
    this.pageChange();
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  private filterRelationhships(): void {
    if (this.substance.relationships && this.substance.relationships.length > 0) {
      this.substance.relationships.forEach(relationship => {
        const typeParts = relationship.type;
        const property = typeParts && typeParts.trim() || '';
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
    }
  }

  private hasDetails(current): boolean {
    if ((current.mediatorSubstance && current.mediatorSubstance.name)
      || (current.amount)
      || (current.qualification)
      || (current.interactionType)) {
      return true;
    } else {
      return false;
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilService.getSafeStructureImgUrl(structureId, size);
  }

  openModal(templateRef) {

    this.gaService.sendEvent(this.analyticsEventCategory, 'button', 'references view');

    const dialogRef = this.dialog.open(templateRef, {});
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  formatValue(v) {
    if (v) {
      if (typeof v === 'object') {
        if (v.display) {
          return v.display;
        } else if (v.value) {
          return v.value;
        } else {
          return null;
        }
      } else {
        return v;
      }
    }
    return null;
  }

  displayAmount(amt): string {
    let ret = '';
    if (amt) {
      if (typeof amt === 'object') {
        if (amt) {
          let addedunits = false;
          let unittext = this.formatValue(amt.units);
          if (!unittext) {
            unittext = '';
          }
            const atype = this.formatValue(amt.type);
            if (atype) {
              ret += atype + '\n';
            }
            if (amt.average || amt.high || amt.low) {
              if (amt.average) {
                ret += amt.average;
                if (amt.units) {
                  ret += ' ' + unittext;
                  addedunits = true;
                }
              }
              if (amt.high || amt.low) {
                ret += ' [';
                if (amt.high && !amt.low) {
                  ret += '<' + amt.high;
                } else if (!amt.high && amt.low) {
                  ret += '>' + amt.low;
                } else if (amt.high && amt.low) {
                  ret += amt.low + ' to ' + amt.high;
                }
                ret += '] ';
                if (!addedunits) {
                  if (amt.units) {
                    ret += ' ' + unittext;
                    addedunits = true;
                  }
                }
              }
              ret += ' (average) ';
            }
            if (amt.highLimit || amt.lowLimit) {
              ret += '\n[';
            }
            if (amt.highLimit && !amt.lowLimit) {
              ret += '<' + amt.highLimit;
            } else if (!amt.highLimit && amt.lowLimit) {
              ret += '>' + amt.lowLimit;
            } else if (amt.highLimit && amt.lowLimit) {
              ret += amt.lowLimit + ' to ' + amt.highLimit;
            }
            if (amt.highLimit || amt.lowLimit) {
              ret += '] ';
              if (!addedunits) {
                if (amt.units) {
                  ret += ' ' + unittext;
                  addedunits = true;
                }
              }
              ret += ' (limits)';
            }
          }
      }
    }
    return ret;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
