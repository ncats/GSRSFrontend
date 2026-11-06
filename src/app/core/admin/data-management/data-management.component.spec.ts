import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { LoadingService } from '@gsrs-core/loading';
import { DataManagementComponent } from './data-management.component';

describe('DataManagementComponent upload', () => {
  let component: DataManagementComponent;
  let request: Subject<any>;
  let admin: jasmine.SpyObj<AdminService>;
  let router: jasmine.SpyObj<Router>;
  let loading: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    request = new Subject();
    admin = jasmine.createSpyObj('AdminService', ['loadData']);
    admin.loadData.and.returnValue(request);
    router = jasmine.createSpyObj('Router', ['navigate']);
    loading = jasmine.createSpyObj('LoadingService', ['setLoading']);
    component = new DataManagementComponent(new FormBuilder(), admin, router,
      new ActivatedRoute(), loading);
    component.ngOnInit();
    component.uploadForm.get('file').setValue(new File(['data'], 'test.gsrs'));
  });

  it('blocks duplicate submissions and navigates after success', () => {
    component.onSubmit();
    component.onSubmit();
    expect(admin.loadData).toHaveBeenCalledTimes(1);
    expect(component.processing).toBeTrue();
    request.next({ id: 1 });
    expect(router.navigate).toHaveBeenCalledWith(['/monitor/1']);
    expect(component.processing).toBeFalse();
    expect(loading.setLoading).toHaveBeenCalledWith(false);
  });

  it('shows the backend reason and HTTP status instead of hiding them', () => {
    component.onSubmit();
    request.error(new HttpErrorResponse({ status: 413, error: { message: 'Database packet limit exceeded' } }));
    expect(component.message).toContain('HTTP 413');
    expect(component.message).toContain('Database packet limit exceeded');
    expect(component.processing).toBeFalse();
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
