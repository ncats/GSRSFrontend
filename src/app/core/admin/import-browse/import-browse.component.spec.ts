import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBrowseComponent } from './import-browse.component';

describe('ImportBrowseComponent', () => {
  let component: ImportBrowseComponent;
  let fixture: ComponentFixture<ImportBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBrowseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
