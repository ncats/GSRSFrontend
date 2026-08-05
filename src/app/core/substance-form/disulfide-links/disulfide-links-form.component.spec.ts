import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisulfideLinksFormComponent } from './disulfide-links-form.component';

describe('DisulfideLinksFormComponent', () => {
  let component: DisulfideLinksFormComponent;
  let fixture: ComponentFixture<DisulfideLinksFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisulfideLinksFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisulfideLinksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
