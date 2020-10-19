import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyDisulfideDialogComponent } from './copy-disulfide-dialog.component';

describe('CopyDisulfideDialogComponent', () => {
  let component: CopyDisulfideDialogComponent;
  let fixture: ComponentFixture<CopyDisulfideDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyDisulfideDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDisulfideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
