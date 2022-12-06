import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mSchemeViewComponent } from './ssg4m-scheme-view.component';

describe('Ssg4mSchemeViewComponent', () => {
  let component: Ssg4mSchemeViewComponent;
  let fixture: ComponentFixture<Ssg4mSchemeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mSchemeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mSchemeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
