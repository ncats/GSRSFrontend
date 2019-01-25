import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceModificationsComponent } from './substance-modifications.component';

describe('SubstanceModificationsComponent', () => {
  let component: SubstanceModificationsComponent;
  let fixture: ComponentFixture<SubstanceModificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceModificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
