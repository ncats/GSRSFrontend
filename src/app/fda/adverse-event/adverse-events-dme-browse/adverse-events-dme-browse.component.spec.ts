import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventsDmeBrowseComponent } from './adverse-events-dme-browse.component';

describe('AdverseEventsDmeBrowseComponent', () => {
  let component: AdverseEventsDmeBrowseComponent;
  let fixture: ComponentFixture<AdverseEventsDmeBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdverseEventsDmeBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventsDmeBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
