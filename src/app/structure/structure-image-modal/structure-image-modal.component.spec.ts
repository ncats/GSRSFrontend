import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StructureImageModalComponent } from './structure-image-modal.component';
import { MatTabsModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRefStub } from '../../../testing/mat-dialog-ref-stub';

describe('StructureImageModalComponent', () => {
  let component: StructureImageModalComponent;
  let fixture: ComponentFixture<StructureImageModalComponent>;
  let matDialogRefStub: Partial<MatDialogRef<StructureImageModalComponent>>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    matDialogRefStub = new MatDialogRefStub();

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
        { provide: MAT_DIALOG_DATA, useValue: [] }
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
