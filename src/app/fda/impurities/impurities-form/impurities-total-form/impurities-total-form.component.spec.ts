import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesTotalFormComponent } from './impurities-total-form.component';

describe('ImpuritiesTotalFormComponent', () => {
  let component: ImpuritiesTotalFormComponent;
  let fixture: ComponentFixture<ImpuritiesTotalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesTotalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesTotalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
