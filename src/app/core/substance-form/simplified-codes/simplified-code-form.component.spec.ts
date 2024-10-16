import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplifiedCodeFormComponent } from './simplified-code-form.component';

describe('CodeFormComponent', () => {
  let component: SimplifiedCodeFormComponent;
  let fixture: ComponentFixture<SimplifiedCodeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplifiedCodeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplifiedCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
