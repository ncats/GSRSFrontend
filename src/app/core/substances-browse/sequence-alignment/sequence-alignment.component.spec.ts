import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SequenceAlignmentComponent } from './sequence-alignment.component';

describe('SequenceAlignmentComponent', () => {
  let component: SequenceAlignmentComponent;
  let fixture: ComponentFixture<SequenceAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SequenceAlignmentComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceAlignmentComponent);
    component = fixture.componentInstance;
    component.alignmentArray = { subunitIndex: 1, id: '' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
