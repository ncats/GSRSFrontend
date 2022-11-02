import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectWidgetComponent } from './custom-select-widget.component';

describe('CustomSelectWidgetComponent', () => {
  let component: CustomSelectWidgetComponent;
  let fixture: ComponentFixture<CustomSelectWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSelectWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
