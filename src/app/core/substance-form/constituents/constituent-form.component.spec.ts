import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstituentFormComponent } from './constituent-form.component';

describe('ConstituentFormComponent', () => {
  let component: ConstituentFormComponent;
  let fixture: ComponentFixture<ConstituentFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstituentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstituentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
