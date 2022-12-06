import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventsCvmBrowseComponent } from './adverse-events-cvm-browse.component';

describe('AdverseEventsCvmBrowseComponent', () => {
  let component: AdverseEventCvmBrowseComponent;
  let fixture: ComponentFixture<AdverseEventCvmBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseEventCvmBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventCvmBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
