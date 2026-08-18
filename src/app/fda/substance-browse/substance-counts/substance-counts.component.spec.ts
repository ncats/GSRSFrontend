import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApplicationService } from '../../application/service/application.service';
import { GeneralService } from '../../service/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../core/config/config.service';
import { SubstanceCountsComponent } from './substance-counts.component';

describe('SubstanceCountsComponent', () => {
  let component: SubstanceCountsComponent;
  let fixture: ComponentFixture<SubstanceCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceCountsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ApplicationService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceCountsComponent);
    component = fixture.componentInstance;
    component.substance = { uuid: 'test-uuid' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
