import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
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
  let mockSubstanceFormService: {
    ready: ReturnType<typeof vi.fn>;
    isNewRecord: ReturnType<typeof vi.fn>;
    getUuid: ReturnType<typeof vi.fn>;
    updateChangeReason: ReturnType<typeof vi.fn>;
    clearChangeReasonForEdit: ReturnType<typeof vi.fn>;
    changeReason: ReturnType<BehaviorSubject<string | null>['asObservable']>;
  };
  let changeReasonSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    changeReasonSubject = new BehaviorSubject<string | null>(null);

    mockSubstanceFormService = {
      ready: vi.fn().mockReturnValue(of(undefined)),
      isNewRecord: vi.fn(),
      getUuid: vi.fn(),
      updateChangeReason: vi.fn(),
      clearChangeReasonForEdit: vi.fn(),
      changeReason: changeReasonSubject.asObservable()
    };

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

  // ready()/changeReason both emit synchronously (of(...)/BehaviorSubject), so a plain
  // fixture.detectChanges() is enough to observe ngOnInit's effects — no fakeAsync/tick
  // needed (and fakeAsync/tick aren't Vitest-compatible; see the debounce-dependent tests
  // below for the one case that genuinely needs real timer control).

  describe('Dynamic Labeling', () => {
    it('should display "Comment" label for new records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(true);

      fixture.detectChanges();

      expect(component.fieldLabel()).toBe('Comment');
      expect(component.isNewRecord()).toBe(true);
    });

    it('should display "Change Reason" label for existing records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      fixture.detectChanges();

      expect(component.fieldLabel()).toBe('Change Reason');
      expect(component.isNewRecord()).toBe(false);
    });

    it('should emit correct menu label for new record', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(true);

      const emitSpy = vi.spyOn(component.menuLabelUpdate, 'emit');
      fixture.detectChanges();

      expect(emitSpy.mock.calls[emitSpy.mock.calls.length - 1][0]).toBe('Comment');
    });

    it('should emit correct menu label for existing record', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      const emitSpy = vi.spyOn(component.menuLabelUpdate, 'emit');
      fixture.detectChanges();

      expect(emitSpy.mock.calls[emitSpy.mock.calls.length - 1][0]).toBe('Change Reason');
    });
  });

  describe('Placeholder Text', () => {
    it('should show optional placeholder for new records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(true);

      fixture.detectChanges();

      expect(component.placeholderText()).toContain('Optional');
    });

    it('should show required placeholder for existing records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      fixture.detectChanges();

      expect(component.placeholderText()).toContain('Describe why');
    });
  });

  describe('Prefill Clearing', () => {
    it('should NOT prefill historical value for existing records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      // Simulate loading existing record with historical change reason
      changeReasonSubject.next('Previous edit reason from history');

      fixture.detectChanges();

      // Should clear the historical value
      expect(mockSubstanceFormService.clearChangeReasonForEdit.mock.calls.length).toBeGreaterThan(0);
      expect(component.changeReasonControl.value).toBeNull();
    });

    it('should NOT call clearChangeReasonForEdit for new records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(true);

      fixture.detectChanges();

      expect(mockSubstanceFormService.clearChangeReasonForEdit.mock.calls.length).toBe(0);
    });
  });

  describe('Session Value Persistence', () => {
    it('should preserve user-typed value during session', async () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      fixture.detectChanges();

      // User types a value
      component.changeReasonControl.setValue('User typed this');
      // debounceTime(400) on changeReasonControl.valueChanges: wait past it with a real
      // timer rather than fakeAsync/tick (not Vitest-compatible) or vi.useFakeTimers()
      // (risks conflicting with zone.js's own setTimeout patching under Karma).
      await new Promise(resolve => setTimeout(resolve, 600));

      // Simulate another emission from service (e.g., panel switch)
      changeReasonSubject.next('Some other value');

      // User's value should be preserved
      expect(component.changeReasonControl.value).toBe('User typed this');
    });
  });

  describe('Hidden State', () => {
    it('should emit hidden=true for new records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(true);

      const emitSpy = vi.spyOn(component.hiddenStateUpdate, 'emit');
      fixture.detectChanges();

      expect(emitSpy.mock.calls[emitSpy.mock.calls.length - 1][0]).toBe(true);
    });

    it('should emit hidden=false for existing records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      const emitSpy = vi.spyOn(component.hiddenStateUpdate, 'emit');
      fixture.detectChanges();

      expect(emitSpy.mock.calls[emitSpy.mock.calls.length - 1][0]).toBe(false);
    });
  });

  describe('Hint Text', () => {
    it('should show optional hint for new records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(true);

      fixture.detectChanges();

      expect(component.hintText()).toContain('optional');
    });

    it('should show auto-fill hint for existing records', () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      fixture.detectChanges();

      expect(component.hintText()).toContain('auto-fill');
    });
  });

  describe('Reset Session State', () => {
    it('should clear tracking flags and form value on reset', async () => {
      mockSubstanceFormService.isNewRecord.mockReturnValue(false);

      fixture.detectChanges();

      // User types something
      component.changeReasonControl.setValue('Some value');
      await new Promise(resolve => setTimeout(resolve, 600));

      // Reset
      component.resetSessionState();

      expect(component.changeReasonControl.value).toBeNull();
    });
  });
});
