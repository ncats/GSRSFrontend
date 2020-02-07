import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDarrtsDetailsComponent } from './application-darrts-details.component';

describe('ApplicationDarrtsDetailsComponent', () => {
  let component: ApplicationDarrtsDetailsComponent;
  let fixture: ComponentFixture<ApplicationDarrtsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDarrtsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDarrtsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
