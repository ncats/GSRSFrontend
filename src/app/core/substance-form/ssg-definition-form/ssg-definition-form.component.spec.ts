import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsgDefinitionFormComponent } from './ssg-definition-form.component';

describe('SsgDefinitionFormComponent', () => {
  let component: SsgDefinitionFormComponent;
  let fixture: ComponentFixture<SsgDefinitionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsgDefinitionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsgDefinitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
