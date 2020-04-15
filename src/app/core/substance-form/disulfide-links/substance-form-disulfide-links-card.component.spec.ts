import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormDisulfideLinksComponent } from './substance-form-disulfide-links-card.component';

describe('SubstanceFormDisulfideLinksComponent', () => {
  let component: SubstanceFormDisulfideLinksComponent;
  let fixture: ComponentFixture<SubstanceFormDisulfideLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormDisulfideLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormDisulfideLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
