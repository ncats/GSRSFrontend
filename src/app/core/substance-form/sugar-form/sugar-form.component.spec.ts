import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SugarFormComponent } from './sugar-form.component';

describe('SugarFormComponent', () => {
  let component: SugarFormComponent;
  let fixture: ComponentFixture<SugarFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SugarFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SugarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
