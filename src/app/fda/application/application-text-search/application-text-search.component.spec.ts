import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTextSearchComponent } from './application-text-search.component';

describe('ApplicationTextSearchComponent', () => {
  let component: ApplicationTextSearchComponent;
  let fixture: ComponentFixture<ApplicationTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationTextSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
