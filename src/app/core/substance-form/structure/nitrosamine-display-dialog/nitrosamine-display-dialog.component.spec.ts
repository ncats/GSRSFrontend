import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NitrosamineDisplayDialogComponent } from './nitrosamine-display-dialog.component';

describe('NitrosamineDisplayDialogComponent', () => {
  let component: NitrosamineDisplayDialogComponent;
  let fixture: ComponentFixture<NitrosamineDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NitrosamineDisplayDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NitrosamineDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
