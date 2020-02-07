import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAdverseeventdmeComponent } from './substance-adverseeventdme.component';

describe('SubstanceAdverseeventdmeComponent', () => {
  let component: SubstanceAdverseeventdmeComponent;
  let fixture: ComponentFixture<SubstanceAdverseeventdmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceAdverseeventdmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAdverseeventdmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
