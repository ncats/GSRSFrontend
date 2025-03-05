import {Component, OnInit, Input} from '@angular/core';
import { SubstanceMoiety, SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormStructureService } from '../../substance-form/structure/substance-form-structure.service';
import { StructureService } from '@gsrs-core/structure';

@Component({
  selector: 'app-nitrosamine-display',
  templateUrl: './nitrosamine-display.component.html',
  styleUrls: ['./nitrosamine-display.component.scss']
})
export class NitrosamineDisplayComponent implements OnInit {
  private privateStructure: SubstanceStructure | SubstanceMoiety = {};
  privateSmiles: string;
  buttonPressed = false;
  structureDetails: string;
  potencyScore: number;
  smilesInput: string;
  constructor(
   private structureService: StructureService
  ) { }

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
  }

  // Function to highlight a box
  highlightBox(boxId) {
      // Reset all boxes
      document.querySelectorAll('.box, .result-box').forEach(box => {
          box.classList.remove('highlight');
      });
      // Highlight the specified box
      const box = document.getElementById(boxId);
      if (box) {
          box.classList.add('highlight');
      }
  }

  evaluateSmiles() {

      //### The first line will use the smiles from the structure editor, the second will check the html input
      const smilesInput = this.privateSmiles;
    //  const smilesInput = this.smilesInput;
      
    //toggle button state
      this.buttonPressed = true;

      this.structureService.evaluateSmiles(smilesInput).subscribe(data => {
        //setting template variables instead, hidden if the *ngIf conditions are not met, or if these two variables are set to null, which they are by default.
          this.structureDetails = data.structureDetails;
          this.potencyScore = data.potencyScore;
          // Show results panel, change this later
          document.getElementById('resultsPanel').style.display = 'block';
          // Highlight boxes in flowchart
          this.highlightChain(data.highlightedBoxes);
      }, error => {
          console.error('Error:', error);
          alert('Error evaluating SMILES formula. Please check the input and try again.');
      },() => {
          this.buttonPressed = false;
      });
  }

  //dummy function to test everything out. Just switch the method called in the html template and delet this later
  dummyEvaluateSmiles() {
    this.buttonPressed = true;

    let data = {
      "structureDetails": "Type: A. Secondary Amine\nAlpha Hydrogens: 0,1\nCarboxylic Acid: NO\nAryl Alpha: YES\nAllyl Group: NO\nEWG One Side: NO",
      "potencyScore": 2,
      "highlightedBoxes": [
          "q1",
          "q2",
          "q3",
          "calc",
          "score2",
          "cat2"
      ],
      "error": null
  }

  this.structureDetails = data.structureDetails;
  this.potencyScore = data.potencyScore;

document.getElementById('resultsPanel').style.display = 'block';

// Highlight boxes in flowchart (This function and method of selecting boxes should be changed later)
this.highlightChain(data.highlightedBoxes);
setTimeout(() => {
  this.buttonPressed = false;

  }, 2000);

  }
  highlightChain(boxes) {
      // Reset all boxes
      document.querySelectorAll('.box, .result-box').forEach(box => {
          box.classList.remove('highlight');
      });
      // Highlight the specified boxes
      boxes.forEach(boxId => {
          const box = document.getElementById(boxId);
          if (box) {
              box.classList.add('highlight');
          }
      });
  }
}
