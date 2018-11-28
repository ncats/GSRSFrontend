import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { LoadingService } from '../loading.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingServiceStub: Partial<LoadingService> | any;

  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    loadingServiceStub = {
      loadingEvent: new Subject(),
      fireLoadingEvent(event: boolean) {
        this.loadingEvent.next(event);
      }
    };

    TestBed.configureTestingModule({
      imports: [
        MatProgressBarModule
      ],
      declarations: [
        LoadingComponent
      ],
      providers: [
        { provide: LoadingService, useValue: loadingServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle loading component when event is recevied from loading service', async(() => {
    loadingServiceStub.fireLoadingEvent(true);
    fixture.detectChanges();
    let loadingElement: HTMLElement = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(loadingElement).toBeTruthy('should show loading element');
    loadingServiceStub.fireLoadingEvent(false);
    fixture.detectChanges();
    loadingElement = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(loadingElement).toBeFalsy('should hide loading element');
  }));
});
