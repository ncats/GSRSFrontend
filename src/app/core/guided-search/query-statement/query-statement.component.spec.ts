import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryStatementComponent } from './query-statement.component';

describe('QueryStatementComponent', () => {
  let component: QueryStatementComponent;
  let fixture: ComponentFixture<QueryStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
