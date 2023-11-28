import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarsComponent } from './registrars.component';

describe('RegistrarsComponent', () => {
  let component: RegistrarsComponent;
  let fixture: ComponentFixture<RegistrarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
