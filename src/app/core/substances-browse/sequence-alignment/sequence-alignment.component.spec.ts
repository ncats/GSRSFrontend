import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceAlignmentComponent } from './sequence-alignment.component';

describe('SequenceAlignmentComponent', () => {
  let component: SequenceAlignmentComponent;
  let fixture: ComponentFixture<SequenceAlignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceAlignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
