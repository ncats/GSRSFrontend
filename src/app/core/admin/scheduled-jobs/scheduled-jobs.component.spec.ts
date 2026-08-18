import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { ConfigService } from '@gsrs-core/config';
import { ScheduledJobsComponent } from './scheduled-jobs.component';

describe('ScheduledJobsComponent', () => {
  let component: ScheduledJobsComponent;
  let fixture: ComponentFixture<ScheduledJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ScheduledJobsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdminService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
