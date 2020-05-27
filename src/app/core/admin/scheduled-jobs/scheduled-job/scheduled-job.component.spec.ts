import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledJobComponent } from './scheduled-job.component';

describe('ScheduledJobComponent', () => {
  let component: ScheduledJobComponent;
  let fixture: ComponentFixture<ScheduledJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
