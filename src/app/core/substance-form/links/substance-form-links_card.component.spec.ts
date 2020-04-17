import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormLinksCardComponent } from './substance-form-links_card.component';

describe('SubstanceFormLinksComponent', () => {
  let component: SubstanceFormLinksCardComponent;
  let fixture: ComponentFixture<SubstanceFormLinksCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormLinksCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
