import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { LoadingService } from '../loading.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingServiceStub: Partial<LoadingService>;

  beforeEach(async(() => {

    loadingServiceStub = {
      loadingEvent: new Subject()
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
});
