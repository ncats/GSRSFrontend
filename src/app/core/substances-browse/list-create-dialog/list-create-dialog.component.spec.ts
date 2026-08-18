import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';

import { ListCreateDialogComponent } from './list-create-dialog.component';

describe('ListCreateDialogComponent', () => {
  let component: ListCreateDialogComponent;
  let fixture: ComponentFixture<ListCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCreateDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: BulkSearchService, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { message: '' } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
