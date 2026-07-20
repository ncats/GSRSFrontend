import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as moment from 'moment';

/* GSRS Core */
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';

/* GSRS Impurities */
import { GeneralService } from '../../service/general.service';
import { ImpuritiesService } from '../service/impurities.service';
import { Impurities, ImpuritiesSolutionTable } from '../model/impurities.model';


@Component({
  selector: 'app-impurities-lists',
  templateUrl: './impurities-lists.component.html',
  styleUrl: './impurities-lists.component.scss',
  standalone: false
})
export class ImpuritiesListsComponent implements OnInit, OnDestroy {

  // This array is used to render the buttons in the HTML
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  groupedData: { letter: string, items: string[][] }[] = [];
  impuritiesLists: string[][] = [];

  private subscriptions: Array<Subscription> = [];

  totalImpurities: number;
  totalSubstanceRecords: number;
  canEdit = false;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private gaService: GoogleAnalyticsService,
    private mainNotificationService: MainNotificationService,
    private impuritiesService: ImpuritiesService,
    private generalService: GeneralService,
    private titleService: Title
  ) { }

  async ngOnInit() {
    this.loadingService.setLoading(true);

    this.canEdit = await this.authService.hasSpecificPrivilege('Edit');

    this.getImpuritiesLists();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getImpuritiesLists() {

    const impuritiesSubscription = this.impuritiesService.getImpuritiesLists().subscribe({
      next: (data: string[][]) => {

        if (data) {
          this.totalSubstanceRecords = data.length;

          /* TOTAL IMPURITIES BEGIN */
          // Create a Set to hold unique IDs
          const uniqueIds = new Set<string>();

          // Loop through every row we got from the backend
          data.forEach(row => {

            // Loop through columns 2 and higher (where the "Source|||ID" strings live)
            for (let i = 2; i < row.length; i++) {
              const cellValue = row[i];

              if (typeof cellValue === 'string' && cellValue.includes('|||')) {
                // Split "USP|||10" into parts
                const parts = cellValue.split('|||');
                const id = parts[1]; // The ID is the second part

                if (id) {
                  uniqueIds.add(id); // Add it to the Set (Set automatically prevents duplicates)
                }
              }
            }
          });

          // The size of the Set is the true number of unique IDs
          this.totalImpurities = uniqueIds.size;
          /* *** TOTAL IMPURITIES END *** */


          // Group by Substance Name alphabetically ascending order
          this.groupDataByAlphabet(data);
        }

        this.loadingService.setLoading(false);
      },
      error: (err) => {
        console.error('Error fetching impurities lists', err);
        this.loadingService.setLoading(false);
      }
    });
    this.subscriptions.push(impuritiesSubscription);
  }

   groupDataByAlphabet(data: any[][]): void {
    const groups: { [key: string]: any[][] } = {};

    data.forEach(row => {
      let name = row[0]; 
      
      if (name) {
        name = name.trim(); 

        if (name.length > 0) {
          const firstLetter = name.charAt(0).toUpperCase(); 

          if (!groups[firstLetter]) {
            groups[firstLetter] = [];
          }

          // Transform the array elements, keeping ALL of them
          const transformedRow = row.map((item, index) => {
            if (index >= 2 && typeof item === 'string' && item.includes('|||')) {
              const parts = item.split('|||');
              return {
                source: parts[0], 
                id: parts[1]      
              };
            }
            return item; 
          });

          // Push the entire transformed row, which contains all sources
          groups[firstLetter].push(transformedRow);
        }
      }
    });

    this.groupedData = Object.keys(groups).sort().map(letter => {
      return { letter: letter, items: groups[letter] };
    });
  }

  hasDataForLetter(letter: string): boolean {
    // Returns true if the letter is found in our groupedData array
    return this.groupedData.some(group => group.letter === letter);
  }

  scrollToSection(letter: string): void {
    // Prevent scrolling if there's no data (safety check)
    if (!this.hasDataForLetter(letter)) return;

    const element = document.getElementById('section-' + letter);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
