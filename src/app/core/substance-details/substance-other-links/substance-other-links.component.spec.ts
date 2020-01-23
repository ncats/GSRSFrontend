import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceOtherLinksComponent } from './substance-other-links.component';
import { MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

describe('SubstanceOtherLinksComponent', () => {
  let component: SubstanceOtherLinksComponent;
  let fixture: ComponentFixture<SubstanceOtherLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule
      ],
      declarations: [
        SubstanceOtherLinksComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceOtherLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
