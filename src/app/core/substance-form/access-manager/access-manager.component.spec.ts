import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { ElementRef } from '@angular/core';
import { AccessManagerComponent } from './access-manager.component';

describe('AccessManagerComponent', () => {
  let component: AccessManagerComponent;
  let fixture: ComponentFixture<AccessManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatMenuModule ],
      declarations: [ AccessManagerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: ElementRef, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
