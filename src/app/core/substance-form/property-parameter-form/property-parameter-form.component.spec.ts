import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { PropertyParameterFormComponent } from './property-parameter-form.component';

describe('PropertyParameterFormComponent', () => {
  let component: PropertyParameterFormComponent;
  let fixture: ComponentFixture<PropertyParameterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ PropertyParameterFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyParameterFormComponent);
    component = fixture.componentInstance;
    component.parameter = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
