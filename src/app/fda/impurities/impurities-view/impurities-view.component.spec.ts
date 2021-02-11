import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesViewComponent } from './impurities-view.component';

describe('ImpuritiesViewComponent', () => {
  let component: ImpuritiesViewComponent;
  let fixture: ComponentFixture<ImpuritiesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
