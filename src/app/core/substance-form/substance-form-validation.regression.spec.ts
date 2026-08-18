import { of, Subject } from 'rxjs';
import { vi } from 'vitest';
import { SubstanceFormComponent } from './substance-form.component';
import { SubstanceFormService } from './substance-form.service';
import { ValidationResults } from './substance-form.model';

describe('Substance form validation regressions', () => {
  function createService(validationResults: ValidationResults) {
    const substanceService = {
      validateSubstance: vi.fn().mockReturnValue(of(validationResults)),
    };
    const service = new SubstanceFormService(
      substanceService as any,
      { newUUID: () => 'uuid' } as any,
      {} as any,
      {} as any,
    );
    service.loadSubstance('chemical', {
      uuid: 'existing-substance',
      version: '7',
      substanceClass: 'chemical',
      names: [],
      codes: [],
      references: [],
      relationships: [],
      properties: [],
      structure: {
        molfile: 'current editor molfile',
      },
    } as any).subscribe();
    return { service, substanceService };
  }

  it('always calls backend validation for an unchanged existing substance', () => {
    const { service, substanceService } = createService({
      valid: true,
      validationMessages: [],
    });

    service.validateSubstance().subscribe();

    expect(substanceService.validateSubstance.mock.calls.length).toBe(1);
    const payload = substanceService.validateSubstance.mock.calls[substanceService.validateSubstance.mock.calls.length - 1][0];
    expect(payload.uuid).toBe('existing-substance');
    expect(payload.version).toBe('7');
    expect(payload.structure.molfile).toBe('current editor molfile');
  });

  it('passes duplicate, hash, and definitional warnings through unchanged', () => {
    const messages = [
      { messageType: 'WARNING', message: 'possible duplicate' },
      { messageType: 'WARNING', message: 'definitional hash changed' },
      { messageType: 'ERROR', message: 'transaction silently rolled back' },
    ] as any;
    const { service } = createService({
      valid: false,
      validationMessages: messages,
    });

    let result: ValidationResults;
    service.validateSubstance().subscribe(value => result = value);

    expect(result!.valid).toBe(false);
    expect(result!.validationMessages).toEqual(messages);
  });

  function createComponent(validationResponses: Subject<ValidationResults>[]) {
    const component = Object.create(SubstanceFormComponent.prototype) as SubstanceFormComponent;
    let responseIndex = 0;
    (component as any).substanceFormService = {
      validationMutations: vi.fn(),
      validateSubstance: vi.fn(
        () => validationResponses[responseIndex++],
      ),
    };
    (component as any).activatedRoute = { snapshot: { queryParams: {} } };
    (component as any).loadingService = { setLoading: vi.fn() };
    component.validationMessages = [{ messageType: 'ERROR', message: 'old error' } as any];
    component.submissionMessage = 'stale valid message';
    component.showSubmissionMessages = true;
    return component;
  }

  it('clears stale validation state before each backend attempt', () => {
    const response = new Subject<ValidationResults>();
    const component = createComponent([response]);

    component.validate();

    expect(component.validationMessages).toBeNull();
    expect(component.submissionMessage).toBeNull();
    expect(component.showSubmissionMessages).toBe(false);
    expect((component as any).substanceFormService.validateSubstance.mock.calls.length).toBe(1);
  });

  it('does not let an older valid response replace newer validation errors', () => {
    const first = new Subject<ValidationResults>();
    const second = new Subject<ValidationResults>();
    const component = createComponent([first, second]);

    component.validate();
    component.validate();
    second.next({
      valid: false,
      validationMessages: [{ messageType: 'ERROR', message: 'duplicate' } as any],
    });
    first.next({ valid: true, validationMessages: [] });

    expect(component.validationResult).toBe(false);
    expect(component.validationMessages[0].message).toBe('duplicate');
    expect(component.submissionMessage).toBeNull();
  });
});
