import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NitrosamineDisplayComponent } from './nitrosamine-display.component';

describe('NitrosamineDisplayComponent', () => {
  let component: NitrosamineDisplayComponent;
  let fixture: ComponentFixture<NitrosamineDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NitrosamineDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NitrosamineDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
