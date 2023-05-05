import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreateDialogComponent } from './list-create-dialog.component';

describe('ListCreateDialogComponent', () => {
  let component: ListCreateDialogComponent;
  let fixture: ComponentFixture<ListCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCreateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
