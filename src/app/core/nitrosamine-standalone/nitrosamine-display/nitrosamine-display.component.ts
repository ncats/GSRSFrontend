import {Component, OnInit, Input} from '@angular/core';
import { SubstanceMoiety, SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormStructureService } from '../../substance-form/structure/substance-form-structure.service';
import { StructureService } from '@gsrs-core/structure';
import { finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface EvaluationResponse {
  structureDetails: string;
  potencyScore: number;
  highlightedBoxes: string[];
  multipleNitrosamines?: boolean;
  nitrosamineCount?: number;
  error?: string;
}

@Component({
    selector: 'app-nitrosamine-display',
    templateUrl: './nitrosamine-display.component.html',
    styleUrls: ['./nitrosamine-display.component.scss'],
    standalone: false
})
export class NitrosamineDisplayComponent implements OnInit {
  private privateStructure: SubstanceStructure | SubstanceMoiety = {};
  privateSmiles: string;
  buttonPressed = false;
  structureDetails: string;
  potencyScore: number;
  smilesInput: string;
  smilesFormula$: Observable<string>;

  // Add new properties for better state management
  isLoading = false;
  errorMessage: string;
  showResults = false;
  summaryData: Record<string, string> = {};
  responseData: EvaluationResponse;

  constructor(
   private structureService: StructureService
  ) {
    // Initialize fields that depend on structureService
    this.smilesFormula$ = this.structureService.smileObservable$;
  }

   @Input()
    set structure(updatedStructure: SubstanceStructure | SubstanceMoiety) {
      if (updatedStructure != null) {
        this.privateStructure = updatedStructure;
      }
    }
  
    get structure(): (SubstanceStructure | SubstanceMoiety) {
      return this.privateStructure;
    }

    @Input()
    set smiles(updated: string) {
      if (updated != null) {
        this.privateSmiles = updated;
      }
    }
  
    get smiles(): (string) {
      return this.privateSmiles;
    }

  ngOnInit(): void {
    if (this.privateSmiles) {
      this.smilesInput = this.privateSmiles;
    }
    if (!this.smilesInput) {
    this.smilesFormula$.pipe(take(1)).subscribe(res => {
      if (res) {
        this.smilesInput = res;
      }
    });
  }

  }

  // Function to highlight a box
  highlightBox(boxId: string): void {
    // Reset all boxes
    document.querySelectorAll('.box, .result-box').forEach(box => {
        box.classList.remove('highlight', 'highlight-path');
    });
    
    // Highlight the specified box
    const box = document.getElementById(boxId);
    if (box) {
        box.classList.add('highlight-path');
    }
  }

  highlightPathToCategory(categoryBoxId: string): void {
    // Reset all boxes
    document.querySelectorAll('.box, .result-box').forEach(box => {
        box.classList.remove('highlight', 'highlight-path');
    });

    // Define the path mapping
    const pathMapping = {
        'cat5-1': ['q1', 'cat5-1'],
        'cat5-2': ['q1', 'q2', 'cat5-2'],
        'cat5-3': ['q1', 'q2', 'q3', 'cat5-3'],
        'cat4': ['q1', 'q2', 'q3', 'calc', 'score4', 'cat4'],
        'cat3': ['q1', 'q2', 'q3', 'calc', 'score4', 'score3', 'cat3'],
        'cat2': ['q1', 'q2', 'q3', 'calc', 'score4', 'score3', 'score2', 'cat2'],
        'cat1': ['q1', 'q2', 'q3', 'calc', 'score4', 'score3', 'score2', 'score1', 'cat1']
    };

    // Get the path for the category
    const path = pathMapping[categoryBoxId];
    if (path) {
        // Highlight each box in the path
        path.forEach(boxId => {
            const box = document.getElementById(boxId) as HTMLElement;
            if (box) {
                box.classList.add('highlight-path');
            }
        });
    }
  }

  /**
   * Evaluates a SMILES string using the StructureService
   */
  evaluateSmiles(event: Event): void {
    // Prevent default form submission
    event.preventDefault();
        
    // Use value from component property instead of DOM access
    const smiles = this.smilesInput?.trim();
    
    if (!smiles) {
        this.errorMessage = 'Please enter a SMILES string';
        return;
    }

    // Reset state and set loading
    this.errorMessage = null;
    this.isLoading = true;
    this.buttonPressed = true;
    this.showResults = false;
    
    console.log('Evaluating SMILES string:', smiles);
    
    // Call the service with proper error handling and state management
    this.structureService.evaluateSmiles(smiles)
      .pipe(
        finalize(() => {
          console.log('Request completed');
          this.isLoading = false;
          this.buttonPressed = false;
        })
      )
      .subscribe({
        next: (response: EvaluationResponse) => {
          console.log('Response received:', response);
          // Store the response data
          this.responseData = response;
          this.structureDetails = response.structureDetails;
          this.potencyScore = response.potencyScore;
          this.showResults = true;
          
          // Parse structure details into manageable data
          this.parseStructureDetails(response.structureDetails);
          
          // Highlight the appropriate boxes
          if (response.highlightedBoxes && response.highlightedBoxes.length > 0) {
            const categoryBox = response.highlightedBoxes.find(boxId => 
              boxId.startsWith('cat') && !boxId.startsWith('cat5-')
            ) || response.highlightedBoxes.find(boxId => boxId.startsWith('cat'));
            
            if (categoryBox) {
              this.highlightPathToCategory(categoryBox);
            }
          }
        },
        error: (error) => {
          console.error('Error from API:', error);
          this.errorMessage = `Error processing SMILES string: ${error.message || 'Unknown error'}`;
          this.showResults = true;
        }
      });
  }
  
  /**
   * Parse structure details string into a key-value object
   */
  private parseStructureDetails(detailsStr: string): void {
    this.summaryData = {};
    
    if (detailsStr) {
      const details = detailsStr.split('\n');
      details.forEach(detail => {
        const parts = detail.split(':').map(s => s.trim());
        if (parts.length >= 2) {
          const key = parts[0];
          const value = parts.slice(1).join(':').trim(); // Handle values with colons
          if (key && value) {
            this.summaryData[key] = value;
          }
        }
      });
    }
  }

  /**
   * Test function to evaluate predefined SMILES strings
   */
  testSmiles(): void {
    const testCases = [
        'CN(N=O)CH3',          // Simple case
        'CN(N=O)C1=CC=NC=C1',  // With pyridine
        'INVALID'              // Invalid SMILES
    ];
    
    console.log('Testing SMILES:', testCases[0]);
    this.smilesInput = testCases[0];
    this.evaluateSmiles(new Event('submit'));
  }
}
