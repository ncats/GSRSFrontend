import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesInorganicComponent } from './impurities-inorganic.component';

describe('ImpuritiesInorganicComponent', () => {
  let component: ImpuritiesInorganicComponent;
  let fixture: ComponentFixture<ImpuritiesInorganicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesInorganicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesInorganicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
