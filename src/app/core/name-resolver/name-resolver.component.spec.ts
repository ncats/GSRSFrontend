import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameResolverComponent } from './name-resolver.component';

describe('NameResolverComponent', () => {
  let component: NameResolverComponent;
  let fixture: ComponentFixture<NameResolverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NameResolverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
