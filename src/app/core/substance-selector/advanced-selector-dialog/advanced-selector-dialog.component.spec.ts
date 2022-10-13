import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSelectorDialogComponent } from './advanced-selector-dialog.component';

describe('AdvancedSelectorDialogComponent', () => {
  let component: AdvancedSelectorDialogComponent;
  let fixture: ComponentFixture<AdvancedSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedSelectorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
