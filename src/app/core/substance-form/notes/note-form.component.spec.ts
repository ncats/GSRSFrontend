import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';
import { NoteFormComponent } from './note-form.component';

describe('NoteFormComponent', () => {
  let component: NoteFormComponent;
  let fixture: ComponentFixture<NoteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ NoteFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFormComponent);
    component = fixture.componentInstance;
    component.note = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
