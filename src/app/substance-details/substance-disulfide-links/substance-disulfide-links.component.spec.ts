import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceDisulfideLinksComponent } from './substance-disulfide-links.component';
import { MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

describe('SubstanceDisulfideLinksComponent', () => {
  let component: SubstanceDisulfideLinksComponent;
  let fixture: ComponentFixture<SubstanceDisulfideLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule
      ],
      declarations: [
        SubstanceDisulfideLinksComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDisulfideLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
