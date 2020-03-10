import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonDialogComponent } from './json-dialog.component';

describe('JsonDialogComponent', () => {
  let component: JsonDialogComponent;
  let fixture: ComponentFixture<JsonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
