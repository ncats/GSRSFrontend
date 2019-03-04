import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceNotesComponent } from './substance-notes.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';

describe('SubstanceNotesComponent', () => {
  let component: SubstanceNotesComponent;
  let fixture: ComponentFixture<SubstanceNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule
      ],
      declarations: [
        SubstanceNotesComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
