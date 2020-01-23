import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsdrawWrapperComponent } from './jsdraw-wrapper.component';

describe('JsdrawWrapperComponent', () => {
  let component: JsdrawWrapperComponent;
  let fixture: ComponentFixture<JsdrawWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsdrawWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsdrawWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
