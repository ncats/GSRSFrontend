import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { CacheSummaryComponent } from './cache-summary.component';

describe('CacheSummaryComponent', () => {
  let component: CacheSummaryComponent;
  let fixture: ComponentFixture<CacheSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ CacheSummaryComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdminService, useValue: { getEnvironmentHealth: () => of({
          runtime: { availableProcessors: 0, freeMemory: 0, maxMemory: 0, totalMemory: 0 },
          cacheInfo: { maxCacheElements: 0, maxNotEvictableCacheElements: 0, timeToIdle: 0, timeToLive: 0 },
          databaseInformation: '', epoch: 0, hostname: '', javaVersion: '', runningThreads: 0, threads: []
        }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
