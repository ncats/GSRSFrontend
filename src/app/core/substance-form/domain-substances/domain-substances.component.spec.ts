import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainSubstancesComponent } from './domain-substances.component';

describe('DomainSubstancesComponent', () => {
  let component: DomainSubstancesComponent;
  let fixture: ComponentFixture<DomainSubstancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainSubstancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainSubstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
