import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousReferencesComponent } from './previous-references.component';

describe('PreviousReferencesComponent', () => {
  let component: PreviousReferencesComponent;
  let fixture: ComponentFixture<PreviousReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
