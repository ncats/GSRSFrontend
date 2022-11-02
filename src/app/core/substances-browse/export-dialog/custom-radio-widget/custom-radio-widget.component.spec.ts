import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRadioWidgetComponent } from './custom-radio-widget.component';

describe('CustomRadioWidgetComponent', () => {
  let component: CustomRadioWidgetComponent;
  let fixture: ComponentFixture<CustomRadioWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomRadioWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRadioWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
