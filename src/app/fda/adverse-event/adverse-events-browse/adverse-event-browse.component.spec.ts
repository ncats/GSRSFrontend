import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventBrowseComponent } from './adverse-event-browse.component';

describe('AdverseEventBrowseComponent', () => {
  let component: AdverseEventBrowseComponent;
  let fixture: ComponentFixture<AdverseEventBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseEventBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
