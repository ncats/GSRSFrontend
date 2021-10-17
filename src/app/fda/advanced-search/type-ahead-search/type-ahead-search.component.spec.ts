import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAheadSearchComponent } from './type-ahead-search.component';

describe('TypeAheadSearchComponent', () => {
  let component: TypeAheadSearchComponent;
  let fixture: ComponentFixture<TypeAheadSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeAheadSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAheadSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
