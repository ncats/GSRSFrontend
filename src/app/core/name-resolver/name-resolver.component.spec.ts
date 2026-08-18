import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '../loading/loading.service';
import { SubstanceService } from '../substance/substance.service';
import { StructureService } from '../structure/structure.service';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NameResolverComponent } from './name-resolver.component';

describe('NameResolverComponent', () => {
  let component: NameResolverComponent;
  let fixture: ComponentFixture<NameResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ NameResolverComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: SubstanceService, useValue: {} },
        { provide: StructureService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
