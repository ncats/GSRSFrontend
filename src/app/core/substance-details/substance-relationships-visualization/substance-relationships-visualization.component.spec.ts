import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceRelationshipsVisualizationComponent } from './substance-relationships-visualization.component';

describe('SubstanceRelationshipsVisualizationComponent', () => {
  let component: SubstanceRelationshipsVisualizationComponent;
  let fixture: ComponentFixture<SubstanceRelationshipsVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceRelationshipsVisualizationComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v, bypassSecurityTrustUrl: (v: any) => v, bypassSecurityTrustResourceUrl: (v: any) => v } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceRelationshipsVisualizationComponent);
    component = fixture.componentInstance;
    component.substance = { uuid: 'test-uuid' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
