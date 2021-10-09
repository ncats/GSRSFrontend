import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDictionaryComponent } from './substance-dictionary.component';

describe('SubstanceSummaryCardComponent', () => {
  let component: SubstanceDictionaryComponent;
  let fixture: ComponentFixture<SubstanceDictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceDictionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
