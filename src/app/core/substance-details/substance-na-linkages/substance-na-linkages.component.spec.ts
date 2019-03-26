import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceNaLinkagesComponent } from './substance-na-linkages.component';
import { MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

describe('SubstanceNaLinkagesComponent', () => {
  let component: SubstanceNaLinkagesComponent;
  let fixture: ComponentFixture<SubstanceNaLinkagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule
      ],
      declarations: [
        SubstanceNaLinkagesComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceNaLinkagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
