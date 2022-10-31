import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMultiselectWidgetComponent } from './custom-multiselect-widget.component';

describe('CustomMultiselectWidgetComponent', () => {
  let component: CustomMultiselectWidgetComponent;
  let fixture: ComponentFixture<CustomMultiselectWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMultiselectWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMultiselectWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
