import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportScrubberComponent } from './import-scrubber.component';

describe('ImportScrubberComponent', () => {
  let component: ImportScrubberComponent;
  let fixture: ComponentFixture<ImportScrubberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportScrubberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportScrubberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
