import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDisulfideLinksComponent } from './substance-disulfide-links.component';

describe('SubstanceDisulfideLinksComponent', () => {
  let component: SubstanceDisulfideLinksComponent;
  let fixture: ComponentFixture<SubstanceDisulfideLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceDisulfideLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDisulfideLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
