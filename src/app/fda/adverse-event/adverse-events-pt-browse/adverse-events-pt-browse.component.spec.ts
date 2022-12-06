import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventsPtBrowseComponent } from './adverse-events-pt-browse.component';

describe('AdverseEventsBrowseComponent', () => {
  let component: AdverseEventsPtBrowseComponent;
  let fixture: ComponentFixture<AdverseEventsPtBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseEventsPtBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventsPtBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
