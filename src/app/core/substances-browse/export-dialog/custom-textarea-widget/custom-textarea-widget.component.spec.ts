import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTextareaWidgetComponent } from './custom-textarea-widget.component';

describe('CustomTextareaWidgetComponent', () => {
  let component: CustomTextareaWidgetComponent;
  let fixture: ComponentFixture<CustomTextareaWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomTextareaWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTextareaWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
