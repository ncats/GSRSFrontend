import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubunitSelectorComponent } from './subunit-selector.component';

describe('SubunitSelectorComponent', () => {
  let component: SubunitSelectorComponent;
  let fixture: ComponentFixture<SubunitSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubunitSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
