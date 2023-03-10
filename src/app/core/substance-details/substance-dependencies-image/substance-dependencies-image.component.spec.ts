import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDependenciesImageComponent } from './substance-dependencies-image.component';

describe('SubstanceDisplayImageComponent', () => {
  let component: SubstanceDependenciesImageComponent;
  let fixture: ComponentFixture<SubstanceDependenciesImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceDependenciesImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDependenciesImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
