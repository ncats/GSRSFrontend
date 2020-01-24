import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StructureImageModalComponent } from './structure-image-modal.component';
import { MatTabsModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRefStub } from '../../../testing/mat-dialog-ref-stub';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('StructureImageModalComponent', () => {
  let component: StructureImageModalComponent;
  let fixture: ComponentFixture<StructureImageModalComponent>;
  let matDialogRefStub: Partial<MatDialogRef<StructureImageModalComponent>>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    matDialogRefStub = new MatDialogRefStub();
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        HttpClientTestingModule
      ],
      declarations: [
        StructureImageModalComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: UtilsService, useValue: UtilsServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
