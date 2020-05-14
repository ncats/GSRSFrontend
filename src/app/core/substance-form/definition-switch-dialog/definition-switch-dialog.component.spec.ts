import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionSwitchDialogComponent } from './definition-switch-dialog.component';

describe('DefinitionSwitchDialogComponent', () => {
  let component: DefinitionSwitchDialogComponent;
  let fixture: ComponentFixture<DefinitionSwitchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinitionSwitchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionSwitchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
