import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceMoietiesComponent } from './substance-moieties.component';

describe('SubstanceMoietiesComponent', () => {
  let component: SubstanceMoietiesComponent;
  let fixture: ComponentFixture<SubstanceMoietiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceMoietiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMoietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
