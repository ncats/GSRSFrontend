import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SubstanceSsg1ParentComponent } from './substance-ssg1-parent.component';

describe('SubstanceSsg1ParentComponent', () => {
  let component: SubstanceSsg1ParentComponent;
  let fixture: ComponentFixture<SubstanceSsg1ParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceSsg1ParentComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsg1ParentComponent);
    component = fixture.componentInstance;
    component.substance = { $$constituentParents: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
