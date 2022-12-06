import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mSitesComponent } from './ssg4m-sites.component';

describe('Ssg4mSitesComponent', () => {
  let component: Ssg4mSitesComponent;
  let fixture: ComponentFixture<Ssg4mSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
