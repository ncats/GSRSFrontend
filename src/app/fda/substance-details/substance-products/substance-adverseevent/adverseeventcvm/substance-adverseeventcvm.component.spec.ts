import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAdverseeventcvmComponent } from './substance-adverseeventcvm.component';

describe('SubstanceAdverseeventcvmComponent', () => {
  let component: SubstanceAdverseeventcvmComponent;
  let fixture: ComponentFixture<SubstanceAdverseeventcvmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceAdverseeventcvmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAdverseeventcvmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
