import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMultiCheckboxWidgetComponent } from './custom-multi-checkbox-widget.component';

describe('CustomMultiCheckboxWidgetComponent', () => {
  let component: CustomMultiCheckboxWidgetComponent;
  let fixture: ComponentFixture<CustomMultiCheckboxWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMultiCheckboxWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMultiCheckboxWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
