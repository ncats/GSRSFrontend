import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceGlycosylationComponent } from './substance-glycosylation.component';
import { MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

describe('SubstanceGlycosylationComponent', () => {
  let component: SubstanceGlycosylationComponent;
  let fixture: ComponentFixture<SubstanceGlycosylationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule
      ],
      declarations: [
        SubstanceGlycosylationComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceGlycosylationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
