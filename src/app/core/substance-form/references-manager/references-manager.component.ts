import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ReferencesContainer } from './references-container.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-references-manager',
  templateUrl: './references-manager.component.html',
  styleUrls: ['./references-manager.component.scss']
})
export class ReferencesManagerComponent implements OnInit {
  @Input() referencesIn?: Observable<ReferencesContainer>;
  @Output() referencesOut = new EventEmitter<ReferencesContainer>();
  references: Array<SubstanceReference>;

  constructor() { }

  ngOnInit() {
  }

}
