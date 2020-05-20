import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadMonitorComponent } from './download-monitor.component';

describe('DownloadMonitorComponent', () => {
  let component: DownloadMonitorComponent;
  let fixture: ComponentFixture<DownloadMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
