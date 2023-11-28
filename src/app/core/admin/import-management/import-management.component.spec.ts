import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportManagementComponent } from './import-management.component';

describe('ImportManagementComponent', () => {
  let component: ImportManagementComponent;
  let fixture: ComponentFixture<ImportManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
