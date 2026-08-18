import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@gsrs-core/auth';
import { vi } from 'vitest';

import { UserDownloadsComponent } from './user-downloads.component';

describe('UserDownloadsComponent', () => {
  let component: UserDownloadsComponent;
  let fixture: ComponentFixture<UserDownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDownloadsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: { getAllDownloads: vi.fn().mockReturnValue(of({ downloads: [] })) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
