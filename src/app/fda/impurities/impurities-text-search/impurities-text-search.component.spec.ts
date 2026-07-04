import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesTextSearchComponent } from './impurities-text-search.component';

describe('ImpuritiesTextSearchComponent', () => {
  let component: ImpuritiesTextSearchComponent;
  let fixture: ComponentFixture<ImpuritiesTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpuritiesTextSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpuritiesTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
