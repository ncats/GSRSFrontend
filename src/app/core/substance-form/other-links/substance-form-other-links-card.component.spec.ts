import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormOtherLinksCardComponent } from './substance-form-other-links-card.component';

describe('SubstanceFormOtherLinksComponent', () => {
  let component: SubstanceFormOtherLinksCardComponent;
  let fixture: ComponentFixture<SubstanceFormOtherLinksCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormOtherLinksCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormOtherLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
