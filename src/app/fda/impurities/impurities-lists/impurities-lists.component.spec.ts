import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesListsComponent } from './impurities-lists.component';

describe('ImpuritiesListsComponent', () => {
  let component: ImpuritiesListsComponent;
  let fixture: ComponentFixture<ImpuritiesListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpuritiesListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpuritiesListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
