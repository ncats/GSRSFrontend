import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormStructureService } from '../structure/substance-form-structure.service';
import { SubstanceFormMoietiesComponent } from './substance-form-moieties.component';

describe('SubstanceFormMoietiesComponent', () => {
  let component: SubstanceFormMoietiesComponent;
  let fixture: ComponentFixture<SubstanceFormMoietiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormMoietiesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormStructureService, useValue: { substanceMoieties: NEVER } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMoietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
