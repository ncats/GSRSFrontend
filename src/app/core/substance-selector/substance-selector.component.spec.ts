import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSelectorComponent } from './substance-selector.component';

describe('SubstanceSelectorComponent', () => {
  let component: SubstanceSelectorComponent;
  let fixture: ComponentFixture<SubstanceSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
