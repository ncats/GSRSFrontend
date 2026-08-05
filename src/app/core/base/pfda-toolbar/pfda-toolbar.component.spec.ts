import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PfdaToolbarComponent } from './pfda-toolbar.component';

describe('PfdaToolbarComponent', () => {
  let component: PfdaToolbarComponent;
  let fixture: ComponentFixture<PfdaToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PfdaToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PfdaToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
