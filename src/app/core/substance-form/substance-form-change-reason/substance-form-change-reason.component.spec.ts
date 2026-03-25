import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BehaviorSubject, of } from 'rxjs';

import { SubstanceFormChangeReasonComponent } from './substance-form-change-reason.component';
import { SubstanceFormService } from '../substance-form.service';

describe('SubstanceFormChangeReasonComponent', () => {
  let component: SubstanceFormChangeReasonComponent;
  let fixture: ComponentFixture<SubstanceFormChangeReasonComponent>;
  let mockSubstanceFormService: jasmine.SpyObj<SubstanceFormService>;
  let changeReasonSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    changeReasonSubject = new BehaviorSubject<string | null>(null);

    mockSubstanceFormService = jasmine.createSpyObj('SubstanceFormService', [
      'ready',
      'isNewRecord',
      'getUuid',
      'updateChangeReason',
      'clearChangeReasonForEdit'
    ], {
      changeReason: changeReasonSubject.asObservable()
    });

    mockSubstanceFormService.ready.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [SubstanceFormChangeReasonComponent],
      providers: [
        provideAnimationsAsync('noop'),
        { provide: SubstanceFormService, useValue: mockSubstanceFormService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubstanceFormChangeReasonComponent);
    component = fixture.componentInstance;
  });

  describe('Dynamic Labeling', () => {
    it('should display "Comment" label for new records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(true);

      fixture.detectChanges();
      tick();

      expect(component.fieldLabel()).toBe('Comment');
      expect(component.isNewRecord()).toBe(true);
    }));

    it('should display "Change Reason" label for existing records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      fixture.detectChanges();
      tick();

      expect(component.fieldLabel()).toBe('Change Reason');
      expect(component.isNewRecord()).toBe(false);
    }));

    it('should emit correct menu label for new record', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(true);

      spyOn(component.menuLabelUpdate, 'emit');
      fixture.detectChanges();
      tick();

      expect(component.menuLabelUpdate.emit).toHaveBeenCalledWith('Comment');
    }));

    it('should emit correct menu label for existing record', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      spyOn(component.menuLabelUpdate, 'emit');
      fixture.detectChanges();
      tick();

      expect(component.menuLabelUpdate.emit).toHaveBeenCalledWith('Change Reason');
    }));
  });

  describe('Placeholder Text', () => {
    it('should show optional placeholder for new records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(true);

      fixture.detectChanges();
      tick();

      expect(component.placeholderText()).toContain('Optional');
    }));

    it('should show required placeholder for existing records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      fixture.detectChanges();
      tick();

      expect(component.placeholderText()).toContain('Describe why');
    }));
  });

  describe('Prefill Clearing', () => {
    it('should NOT prefill historical value for existing records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      // Simulate loading existing record with historical change reason
      changeReasonSubject.next('Previous edit reason from history');

      fixture.detectChanges();
      tick();

      // Should clear the historical value
      expect(mockSubstanceFormService.clearChangeReasonForEdit).toHaveBeenCalled();
      expect(component.changeReasonControl.value).toBeNull();
    }));

    it('should NOT call clearChangeReasonForEdit for new records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(true);

      fixture.detectChanges();
      tick();

      expect(mockSubstanceFormService.clearChangeReasonForEdit).not.toHaveBeenCalled();
    }));
  });

  describe('Session Value Persistence', () => {
    it('should preserve user-typed value during session', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      fixture.detectChanges();
      tick();

      // User types a value
      component.changeReasonControl.setValue('User typed this');
      tick(600); // debounce time

      // Simulate another emission from service (e.g., panel switch)
      changeReasonSubject.next('Some other value');
      tick();

      // User's value should be preserved
      expect(component.changeReasonControl.value).toBe('User typed this');
    }));
  });

  describe('Hidden State', () => {
    it('should emit hidden=true for new records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(true);

      spyOn(component.hiddenStateUpdate, 'emit');
      fixture.detectChanges();
      tick();

      expect(component.hiddenStateUpdate.emit).toHaveBeenCalledWith(true);
    }));

    it('should emit hidden=false for existing records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      spyOn(component.hiddenStateUpdate, 'emit');
      fixture.detectChanges();
      tick();

      expect(component.hiddenStateUpdate.emit).toHaveBeenCalledWith(false);
    }));
  });

  describe('Hint Text', () => {
    it('should show optional hint for new records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(true);

      fixture.detectChanges();
      tick();

      expect(component.hintText()).toContain('optional');
    }));

    it('should show auto-fill hint for existing records', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      fixture.detectChanges();
      tick();

      expect(component.hintText()).toContain('auto-fill');
    }));
  });

  describe('Reset Session State', () => {
    it('should clear tracking flags and form value on reset', fakeAsync(() => {
      mockSubstanceFormService.isNewRecord.and.returnValue(false);

      fixture.detectChanges();
      tick();

      // User types something
      component.changeReasonControl.setValue('Some value');
      tick(600);

      // Reset
      component.resetSessionState();

      expect(component.changeReasonControl.value).toBeNull();
    }));
  });
});
