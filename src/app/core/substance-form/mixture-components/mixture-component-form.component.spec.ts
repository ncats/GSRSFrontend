import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixtureComponentFormComponent } from './mixture-component-form.component';

describe('MixtureComponentFormComponent', () => {
  let component: MixtureComponentFormComponent;
  let fixture: ComponentFixture<MixtureComponentFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MixtureComponentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixtureComponentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
