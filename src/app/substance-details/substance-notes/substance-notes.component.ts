import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
  selector: 'app-substance-notes',
  templateUrl: './substance-notes.component.html',
  styleUrls: ['./substance-notes.component.scss']
})
export class SubstanceNotesComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
