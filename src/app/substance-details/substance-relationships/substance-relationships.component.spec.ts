import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { MatTableModule } from '@angular/material/table';
import { ConfigService } from '../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SubstanceRelationshipsComponent', () => {
  let component: SubstanceRelationshipsComponent;
  let fixture: ComponentFixture<SubstanceRelationshipsComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceRelationshipsComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
