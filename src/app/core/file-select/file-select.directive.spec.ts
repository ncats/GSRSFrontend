import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectDirective } from './file-select.directive';

describe('FileSelectComponent', () => {
  let component: FileSelectDirective;
  let fixture: ComponentFixture<FileSelectDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSelectDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelectDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
