import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormDisulfideLinksService } from './substance-form-disulfide-links.service';
import { Link } from '@gsrs-core/substance';

import { DisulfideLinksFormComponent } from './disulfide-links-form.component';

describe('DisulfideLinksFormComponent', () => {
  let component: DisulfideLinksFormComponent;
  let fixture: ComponentFixture<DisulfideLinksFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // template binds [formControlName] on a real <mat-select>, so it needs a real
      // ControlValueAccessor - NO_ERRORS_SCHEMA doesn't substitute for that.
      imports: [ ReactiveFormsModule, MatSelectModule, NoopAnimationsModule ],
      declarations: [ DisulfideLinksFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceFormService, useValue: {} },
        // ngAfterViewInit (deferred via setTimeout) subscribes to substanceCysteineSites directly.
        { provide: SubstanceFormDisulfideLinksService, useValue: { substanceCysteineSites: of([]) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisulfideLinksFormComponent);
    component = fixture.componentInstance;
    // ngOnInit reads this.link.sites with no undefined guard on `link` itself.
    component.link = {} as Link;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
