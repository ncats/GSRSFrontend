import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAdverseeventptComponent } from './substance-adverseeventpt.component';

describe('SubstanceAdverseeventptComponent', () => {
  let component: SubstanceAdverseeventptComponent;
  let fixture: ComponentFixture<SubstanceAdverseeventptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceAdverseeventptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAdverseeventptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
