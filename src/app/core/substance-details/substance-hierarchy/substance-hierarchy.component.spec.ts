import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';

import { SubstanceHierarchyComponent } from './substance-hierarchy.component';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { AuthService } from '@gsrs-core/auth';

describe('SubstanceHierarchyComponent', () => {
  let component: SubstanceHierarchyComponent;
  let fixture: ComponentFixture<SubstanceHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceHierarchyComponent ],
      providers: [
        { provide: SubstanceService, useValue: { getHierarchy: () => of([]) } },
        { provide: AuthService, useValue: { hasPrivilege: () => false } },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceHierarchyComponent);
    component = fixture.componentInstance;
    // substance is a plain property (set by the DynamicComponentLoader in real usage, not an
    // @Input() binding); ngOnInit() reads substance.uuid/._nameHTML directly.
    component.substance = { uuid: 'test-uuid', _nameHTML: 'Test Substance' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
