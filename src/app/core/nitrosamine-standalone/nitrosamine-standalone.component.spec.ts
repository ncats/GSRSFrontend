import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NitrosamineStandaloneComponent } from './nitrosamine-standalone.component';

describe('NitrosamineStandaloneComponent', () => {
  let component: NitrosamineStandaloneComponent;
  let fixture: ComponentFixture<NitrosamineStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NitrosamineStandaloneComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NitrosamineStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
