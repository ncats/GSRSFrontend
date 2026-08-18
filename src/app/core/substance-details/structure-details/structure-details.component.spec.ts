import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StructureDetailsComponent } from './structure-details.component';
import { ConfigService } from '../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../../testing/utils-service-stub';
import { vi } from 'vitest';

describe('StructureDetailsComponent', () => {
  let component: StructureDetailsComponent;
  let fixture: ComponentFixture<StructureDetailsComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async () => {
    const configServiceSpy = { configData: vi.fn() };
    utilsServiceStub = new UtilsServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        StructureDetailsComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: utilsServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureDetailsComponent);
    component = fixture.componentInstance;
    // template reads several structure.* and substance.* fields with no undefined guard.
    // ngOnInit() itself sets this.structure = this.substance.structure, so `structure`
    // has to come from a real substance.structure shape, not be set directly.
    component.substance = { structure: {}, uuid: 'test-uuid', version: '1' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
