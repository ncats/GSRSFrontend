import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SequenceSearchComponent } from './sequence-search.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterStub } from '../../testing/router-stub';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SequenceSearchComponent', () => {
  let component: SequenceSearchComponent;
  let fixture: ComponentFixture<SequenceSearchComponent>;
  let routerStub: RouterStub;
  let activatedRouteStub: Partial<ActivatedRoute>;
  activatedRouteStub = new ActivatedRouteStub(
    {
      'structure': 'test_structure_term',
      'type': 'test_type_term',
      'similarity': 'test_similarity_term',
      'cutoff': 'test_cutoff_term'
    }
  );

  beforeEach(async(() => {
    routerStub = new RouterStub();

    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      declarations: [
        SequenceSearchComponent
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
