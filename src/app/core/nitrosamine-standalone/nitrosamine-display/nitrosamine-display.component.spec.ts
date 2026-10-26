import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { StructureService } from '@gsrs-core/structure';

import { NitrosamineDisplayComponent } from './nitrosamine-display.component';

describe('NitrosamineDisplayComponent', () => {
  let component: NitrosamineDisplayComponent;
  let fixture: ComponentFixture<NitrosamineDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NitrosamineDisplayComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: StructureService, useValue: { smileObservable$: NEVER } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NitrosamineDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
