import { Component, OnInit } from '@angular/core';
import { Monomer} from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { UtilsService } from '../../utils/utils.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';

@Component({
  selector: 'app-substance-monomers',
  templateUrl: './substance-monomers.component.html',
  styleUrls: ['./substance-monomers.component.scss']
})
export class SubstanceMonomersComponent extends SubstanceCardBaseFilteredList<Monomer> implements OnInit {
  monomers: Array<Monomer>;
  displayedColumns: string[] = ['material', 'amount', 'type'];
  constructor(
    private utilsService: UtilsService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    if (this.substance != null) {
      this.monomers = this.substance.polymer.monomers;
      this.filtered = this.substance.polymer.monomers;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.monomers, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
    }

  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }

}
