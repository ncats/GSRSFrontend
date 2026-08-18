import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledJobComponent } from './scheduled-job.component';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { ConfigService } from '@gsrs-core/config';
import { ScheduledJob } from '@gsrs-core/admin/scheduled-jobs/scheduled-job.model';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MomentModule } from 'ngx-moment';

describe('ScheduledJobComponent', () => {
  let component: ScheduledJobComponent;
  let fixture: ComponentFixture<ScheduledJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatIconModule, MomentModule ],
      declarations: [ ScheduledJobComponent ],
      providers: [
        // ngOnInit calls refresh(true), which calls adminService.fetchJob(...) unconditionally.
        { provide: AdminService, useValue: { fetchJob: () => of({ id: 'test-job-id' } as unknown as ScheduledJob) } },
        { provide: ConfigService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledJobComponent);
    component = fixture.componentInstance;
    // @Input() job.id is read before adminService.fetchJob resolves.
    component.job = { id: 'test-job-id' } as unknown as ScheduledJob;
    component.currentService = 'test-service';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
