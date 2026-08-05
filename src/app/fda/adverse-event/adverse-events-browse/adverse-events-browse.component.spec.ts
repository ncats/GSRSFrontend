import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventsBrowseComponent } from './adverse-events-browse.component';

describe('AdverseEventsBrowseComponent', () => {
  let component: AdverseEventsBrowseComponent;
  let fixture: ComponentFixture<AdverseEventsBrowseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseEventsBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventsBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
