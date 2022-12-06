import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg2OverviewFormComponent } from './ssg2-overview-form.component';

describe('Ssg2OverviewFormComponent', () => {
  let component: Ssg2OverviewFormComponent;
  let fixture: ComponentFixture<Ssg2OverviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg2OverviewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg2OverviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
