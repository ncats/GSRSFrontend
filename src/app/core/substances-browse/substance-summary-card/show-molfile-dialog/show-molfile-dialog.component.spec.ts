import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMolfileDialogComponent } from './show-molfile-dialog.component';

describe('ShowMolfileDialogComponent', () => {
  let component: ShowMolfileDialogComponent;
  let fixture: ComponentFixture<ShowMolfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMolfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMolfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
