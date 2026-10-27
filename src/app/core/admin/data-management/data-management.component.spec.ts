import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { LoadingService } from '@gsrs-core/loading';
import { DataManagementComponent } from './data-management.component';
import { ChangeDetectorRef } from '@angular/core';
import { vi } from 'vitest';

describe('DataManagementComponent upload', () => {
  let component: DataManagementComponent;
  let request: Subject<any>;

  let admin: any;
  let router: any;
  let loading: any;


  beforeEach(() => {

  request = new Subject();

  admin = {
    loadData: vi.fn().mockReturnValue(request)
  };

  router = {
    navigate: vi.fn()
  };

  loading = {
    setLoading: vi.fn()
  };

    
 const cdr = {
    markForCheck: vi.fn()
  } as unknown as ChangeDetectorRef;

  component = new DataManagementComponent(
    new FormBuilder(),
    admin,
    router,
    {} as ActivatedRoute,
    loading,
    cdr
  );

    component.ngOnInit();
    component.uploadForm.get('file').setValue(new File(['data'], 'test.gsrs'));
  });

  it('blocks duplicate submissions and navigates after success', () => {
    component.onSubmit();
    component.onSubmit();
    expect(admin.loadData).toHaveBeenCalledTimes(1);
    expect(component.processing).toBe(true);
    request.next({ id: 1 });
    expect(router.navigate).toHaveBeenCalledWith(['/monitor/1']);
    expect(component.processing).toBe(false);
    expect(loading.setLoading).toHaveBeenCalledWith(false);
  });

  it('shows the backend reason and HTTP status instead of hiding them', () => {
    component.onSubmit();
    request.error(new HttpErrorResponse({ status: 413, error: { message: 'Database packet limit exceeded' } }));
    expect(component.message).toContain('HTTP 413');
    expect(component.message).toContain('Database packet limit exceeded');
    expect(component.processing).toBe(false);
  });

  it('explains an expired session when no backend message is available', () => {
    component.onSubmit();
    request.error(new HttpErrorResponse({ status: 401 }));
    expect(component.message).toContain('Sign in again');
  });

  it('does not submit without a file', () => {
    component.uploadForm.get('file').setValue(null);
    component.onSubmit();
    expect(admin.loadData).not.toHaveBeenCalled();
    expect(component.message).toContain('Select a file');
  });
});
