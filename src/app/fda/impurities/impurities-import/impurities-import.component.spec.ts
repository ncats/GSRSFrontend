import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesImportComponent } from './impurities-import.component';

describe('ImpuritiesImportComponent', () => {
  let component: ImpuritiesImportComponent;
  let fixture: ComponentFixture<ImpuritiesImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpuritiesImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpuritiesImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
