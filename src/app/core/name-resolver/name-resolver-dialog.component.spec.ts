import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameResolverDialogComponent } from './name-resolver-dialog.component';

describe('NameResolverDialogComponent', () => {
  let component: NameResolverDialogComponent;
  let fixture: ComponentFixture<NameResolverDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameResolverDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameResolverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
