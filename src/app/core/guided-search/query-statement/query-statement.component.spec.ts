import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { QueryStatementComponent } from './query-statement.component';

describe('QueryStatementComponent', () => {
  let component: QueryStatementComponent;
  let fixture: ComponentFixture<QueryStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ QueryStatementComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ControlledVocabularyService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryStatementComponent);
    component = fixture.componentInstance;
    // real component reads this._queryableDictionary[anyKey].cvDomain/.type/.lucenePath with no
    // guard, for whatever key the reactive form's initial valueChanges emits; a Proxy avoids
    // needing to know that key ahead of time.
    component.queryableDictionary = new Proxy({}, {
      get: () => ({ cvDomain: null, type: 'string', lucenePath: '' })
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
