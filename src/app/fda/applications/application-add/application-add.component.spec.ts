import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAddComponent } from './application-add.component';

describe('ApplicationAddComponent', () => {
  let component: ApplicationAddComponent;
  let fixture: ComponentFixture<ApplicationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
