import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormSsg4mSitesCardComponent } from './substance-form-ssg4m-sites-card.component';

describe('SubstanceFormSsg4mSitesCardComponent', () => {
  let component: SubstanceFormSsg4mSitesCardComponent;
  let fixture: ComponentFixture<SubstanceFormSsg4mSitesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormSsg4mSitesCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSsg4mSitesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
