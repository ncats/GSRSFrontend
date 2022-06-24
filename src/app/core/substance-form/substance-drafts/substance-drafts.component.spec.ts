import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDraftsComponent } from './substance-drafts.component';

describe('SubstanceDraftsComponent', () => {
  let component: SubstanceDraftsComponent;
  let fixture: ComponentFixture<SubstanceDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceDraftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
