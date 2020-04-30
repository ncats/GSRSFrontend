import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherLinksFormComponent } from './other-links-form.component';

describe('OtherLinksFormComponent', () => {
  let component: OtherLinksFormComponent;
  let fixture: ComponentFixture<OtherLinksFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherLinksFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherLinksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
