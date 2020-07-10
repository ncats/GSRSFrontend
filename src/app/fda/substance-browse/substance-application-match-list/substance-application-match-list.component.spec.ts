import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceApplicationMatchListComponent } from './substance-application-match-list.component';

describe('SubstanceApplicationMatchListComponent', () => {
  let component: SubstanceApplicationMatchListComponent;
  let fixture: ComponentFixture<SubstanceApplicationMatchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceApplicationMatchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceApplicationMatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
