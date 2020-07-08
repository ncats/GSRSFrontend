import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowApplicationToggleComponent } from './show-application-toggle.component';

describe('ShowApplicationToggleComponent', () => {
  let component: ShowApplicationToggleComponent;
  let fixture: ComponentFixture<ShowApplicationToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowApplicationToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowApplicationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
