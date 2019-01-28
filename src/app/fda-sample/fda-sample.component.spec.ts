import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdaSampleComponent } from './fda-sample.component';

describe('FdaSampleComponent', () => {
  let component: FdaSampleComponent;
  let fixture: ComponentFixture<FdaSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdaSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdaSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
