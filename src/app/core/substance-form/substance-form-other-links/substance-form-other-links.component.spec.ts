import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormOtherLinksComponent } from './substance-form-other-links.component';

describe('SubstanceFormOtherLinksComponent', () => {
  let component: SubstanceFormOtherLinksComponent;
  let fixture: ComponentFixture<SubstanceFormOtherLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormOtherLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormOtherLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
