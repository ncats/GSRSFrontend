import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetsManagerComponent } from './facets-manager.component';

describe('FacetsManagerComponent', () => {
  let component: FacetsManagerComponent;
  let fixture: ComponentFixture<FacetsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
