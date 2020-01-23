import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameOrgsComponent } from './name-orgs.component';

describe('NameOrgsComponent', () => {
  let component: NameOrgsComponent;
  let fixture: ComponentFixture<NameOrgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameOrgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameOrgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
