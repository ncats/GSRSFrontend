import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedQueryStatementComponent } from './advanced-query-statement.component';

describe('AdvancedQueryStatementComponent', () => {
  let component: AdvancedQueryStatementComponent;
  let fixture: ComponentFixture<AdvancedQueryStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedQueryStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedQueryStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
