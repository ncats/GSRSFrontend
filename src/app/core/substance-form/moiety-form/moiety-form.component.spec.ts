import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoietyFormComponent } from './moiety-form.component';

describe('MoietyFormComponent', () => {
  let component: MoietyFormComponent;
  let fixture: ComponentFixture<MoietyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoietyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoietyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
