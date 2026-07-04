import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesBrowseComponent } from './impurities-browse.component';

describe('ImpuritiesBrowseComponent', () => {
  let component: ImpuritiesBrowseComponent;
  let fixture: ComponentFixture<ImpuritiesBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpuritiesBrowseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpuritiesBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
