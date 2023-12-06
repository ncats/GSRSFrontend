import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSsg4mComponent } from './substance-ssg4m.component';

describe('SubstanceSsg4mComponent', () => {
  let component: SubstanceSsg4mComponent;
  let fixture: ComponentFixture<SubstanceSsg4mComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceSsg4mComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsg4mComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
