import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormProteinDetailsComponent } from './substance-form-protein-details.component';

describe('SubstanceFormProteinDetailsComponent', () => {
  let component: SubstanceFormProteinDetailsComponent;
  let fixture: ComponentFixture<SubstanceFormProteinDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormProteinDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormProteinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
