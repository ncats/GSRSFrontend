import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceOtherLinksComponent } from './substance-other-links.component';

describe('SubstanceOtherLinksComponent', () => {
  let component: SubstanceOtherLinksComponent;
  let fixture: ComponentFixture<SubstanceOtherLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceOtherLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceOtherLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
