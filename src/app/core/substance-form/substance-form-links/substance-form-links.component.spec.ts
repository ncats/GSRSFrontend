import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormLinksComponent } from './substance-form-links.component';

describe('SubstanceFormLinksComponent', () => {
  let component: SubstanceFormLinksComponent;
  let fixture: ComponentFixture<SubstanceFormLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
