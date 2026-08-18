import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UtilsService } from '@gsrs-core/utils';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MixtureComponentFormComponent } from './mixture-component-form.component';

describe('MixtureComponentFormComponent', () => {
  let component: MixtureComponentFormComponent;
  let fixture: ComponentFixture<MixtureComponentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ MixtureComponentFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MixtureComponentFormComponent);
    component = fixture.componentInstance;
    component.component = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
