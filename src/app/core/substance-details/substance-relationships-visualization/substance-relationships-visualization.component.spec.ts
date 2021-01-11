import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceRelationshipsVisualizationComponent } from './substance-relationships-visualization.component';

describe('SubstanceRelationshipsVisualizationComponent', () => {
  let component: SubstanceRelationshipsVisualizationComponent;
  let fixture: ComponentFixture<SubstanceRelationshipsVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceRelationshipsVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceRelationshipsVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
