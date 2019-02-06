import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstancePropertiesComponent } from './substance-properties.component';

describe('SubstancePropertiesComponent', () => {
  let component: SubstancePropertiesComponent;
  let fixture: ComponentFixture<SubstancePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstancePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstancePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
