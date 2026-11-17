import { Subject } from 'rxjs';
import { SubstanceEditImportDialogComponent } from './substance-edit-import-dialog.component';

describe('SubstanceEditImportDialogComponent import', () => {
  let component: SubstanceEditImportDialogComponent;
  let dialogRef: any;
  let service: any;
  let checkbox: HTMLInputElement;
  let resetResponse: Subject<object>;
  const original = { substanceClass: 'chemical', uuid: 'existing-id' };

  beforeEach(() => {
    resetResponse = new Subject<object>();
    dialogRef = { close: jasmine.createSpy('close') };
    service = {
      resetSubstanceIds: jasmine.createSpy('resetSubstanceIds').and.returnValue(resetResponse)
    };
    component = new SubstanceEditImportDialogComponent(
      null, { configData: { isPfdaVersion: false } } as any,
      dialogRef, null, service
    );
    component.record = JSON.stringify(original);
    component.loaded = true;
    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'replaceIdsCheckbox';
    document.body.appendChild(checkbox);
  });

  afterEach(() => checkbox.remove());

  it('imports the uploaded JSON unchanged when reset is not selected', () => {
    component.importSubstance();

    expect(service.resetSubstanceIds).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
    expect(dialogRef.close).toHaveBeenCalledWith(JSON.stringify(original));
  });

  it('waits for reset and imports the cleaned JSON as a string', () => {
    checkbox.checked = true;
    component.importSubstance();

    expect(service.resetSubstanceIds).toHaveBeenCalledWith(original);
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.loaded).toBe(false);

    const cleaned = { ...original, uuid: 'new-id' };
    resetResponse.next(cleaned);

    expect(dialogRef.close).toHaveBeenCalledTimes(1);
    expect(JSON.parse(dialogRef.close.calls.mostRecent().args[0])).toEqual(cleaned);
  });

  it('keeps the dialog and uploaded JSON available after a reset failure', () => {
    checkbox.checked = true;
    component.importSubstance();
    resetResponse.error(new Error('server unavailable'));

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.record).toBe(JSON.stringify(original));
    expect(component.loaded).toBe(true);
    expect(component.message).toContain('Error resetting UUIDs');
  });

  it('imports pasted JSON without resetting', () => {
    component.currentTab = 1;
    component.pastedJSON = JSON.stringify(original);
    component.importSubstance();

    expect(dialogRef.close).toHaveBeenCalledTimes(1);
    expect(dialogRef.close).toHaveBeenCalledWith(component.pastedJSON);
  });

  it('sends parsed pasted JSON to reset and waits for its response', () => {
    component.currentTab = 1;
    component.pastedJSON = JSON.stringify(original);
    checkbox.checked = true;
    component.importSubstance();

    expect(service.resetSubstanceIds).toHaveBeenCalledWith(original);
    expect(dialogRef.close).not.toHaveBeenCalled();
    resetResponse.next({ ...original, uuid: 'new-id' });
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
    expect(JSON.parse(dialogRef.close.calls.mostRecent().args[0]).uuid).toBe('new-id');
  });
});
