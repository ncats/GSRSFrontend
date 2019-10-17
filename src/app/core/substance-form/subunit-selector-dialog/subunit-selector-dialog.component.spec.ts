import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubunitSelectorDialogComponent } from './subunit-selector-dialog.component';

describe('SubunitSelectorDialogComponent', () => {
  let component: SubunitSelectorDialogComponent;
  let fixture: ComponentFixture<SubunitSelectorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubunitSelectorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
