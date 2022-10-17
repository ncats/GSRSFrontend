import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSearchSearchTermsByIdComponent } from './bulk-search-search-terms-by-id.component';

describe('BulkSearchSearchTermsByIdComponent', () => {
  let component: BulkSearchSearchTermsByIdComponent;
  let fixture: ComponentFixture<BulkSearchSearchTermsByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkSearchSearchTermsByIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSearchSearchTermsByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
