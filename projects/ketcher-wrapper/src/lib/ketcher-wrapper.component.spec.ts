import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KetcherWrapperComponent } from './ketcher-wrapper.component';

describe('KetcherWrapperComponent', () => {
  let component: KetcherWrapperComponent;
  let fixture: ComponentFixture<KetcherWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KetcherWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KetcherWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
