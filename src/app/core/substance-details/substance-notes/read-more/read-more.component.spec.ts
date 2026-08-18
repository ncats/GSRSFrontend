import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { ReadMoreComponent } from './read-more.component';

describe('ReadMoreComponent', () => {
  let component: ReadMoreComponent;
  let fixture: ComponentFixture<ReadMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ReadMoreComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ElementRef, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMoreComponent);
    component = fixture.componentInstance;
    component.text = 'test note text';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
