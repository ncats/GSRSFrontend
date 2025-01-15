import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossEntitySearchComponent } from './cross-entity-search.component';

describe('CrossEntitySearchComponent', () => {
  let component: CrossEntitySearchComponent;
  let fixture: ComponentFixture<CrossEntitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossEntitySearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossEntitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
