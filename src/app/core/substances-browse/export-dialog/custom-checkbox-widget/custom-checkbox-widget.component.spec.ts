import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCheckboxWidgetComponent } from './custom-checkbox-widget.component';

describe('CustomCheckboxWidgetComponent', () => {
  let component: CustomCheckboxWidgetComponent;
  let fixture: ComponentFixture<CustomCheckboxWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCheckboxWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCheckboxWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
