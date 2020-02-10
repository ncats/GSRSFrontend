import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubunitFormComponent } from './subunit-form.component';

describe('SubunitFormComponent', () => {
  let component: SubunitFormComponent;
  let fixture: ComponentFixture<SubunitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubunitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
