import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefernceFormDialogComponent } from './refernce-form-dialog.component';

describe('RefernceFormDialogComponent', () => {
  let component: RefernceFormDialogComponent;
  let fixture: ComponentFixture<RefernceFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefernceFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefernceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
