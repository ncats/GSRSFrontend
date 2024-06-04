import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MolvecModalComponent } from './molvec-modal.component';

describe('MolvecModalComponent', () => {
  let component: MolvecModalComponent;
  let fixture: ComponentFixture<MolvecModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MolvecModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MolvecModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
