import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicalsTrialBrowseComponent } from './clinical-trials-browse.component';

describe('ClinicalsTrialBrowseComponent', () => {
  let component: ClinicalsTrialBrowseComponent;
  let fixture: ComponentFixture<ClinicalsTrialBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalsTrialBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalsTrialBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
