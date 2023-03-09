import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDisplayImageComponent } from './substance-display-image.component';

describe('SubstanceDisplayImageComponent', () => {
  let component: SubstanceDisplayImageComponent;
  let fixture: ComponentFixture<SubstanceDisplayImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceDisplayImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDisplayImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
