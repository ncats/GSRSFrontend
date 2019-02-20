import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceSearchComponent } from './sequence-search.component';

describe('SequenceSearchComponent', () => {
  let component: SequenceSearchComponent;
  let fixture: ComponentFixture<SequenceSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceSearchComponent ]
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
