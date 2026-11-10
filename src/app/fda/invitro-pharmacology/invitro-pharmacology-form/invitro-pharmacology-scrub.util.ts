import jp from 'jsonpath';

// Pure helpers for InvitroPharmacologyFormComponent's save/validation pipeline:
// comparing assay JSON for unsaved-change detection, and scrubbing the
// UI-only `_show` field (plus server-assigned audit fields) before a payload
// is sent to the API or shown in the JSON preview dialog.

export function isJsonSame(sourceJson: any, destinationJson: any): boolean {
  let jsonSame = false;

  if ((sourceJson) && (destinationJson)) {
    if (JSON.stringify(sourceJson) == JSON.stringify(destinationJson)) {
      jsonSame = true;
    }
  }
  return jsonSame;
}

export function scrubShowFieldsSingle(assay: any): void {
  assay.invitroAssayScreenings.forEach(screening => {
    if (screening) {
      if (screening._show) {
        delete screening._show;
      }
    }
  });
}

export function scrubShowFieldsMultiple(assayArray: any): any {
  assayArray.forEach(assay => {
    if (assay) {
      assay.invitroAssayScreenings.forEach(screening => {
        if (screening) {
          if (screening._show) {
            delete screening._show;
          }
        }
      });
    }
  });
  return assayArray;

}

export function isNumber(str: any): boolean {
  if (str) {
    const num = Number(str);
    const nan = isNaN(num);
    return !nan;
  }
  return false;
}

export function scrub(oldraw: any): any {
  const old = oldraw;
  const idHolders = jp.query(old, '$..[?(@.id)]');
  for (let i = 0; i < idHolders.length; i++) {
    if (idHolders[i].id) {
      delete idHolders[i].id;
    }
  }

  const showHolders = jp.query(old, '$..[?(@._show)]');
  for (let i = 0; i < showHolders.length; i++) {
    delete showHolders[i]._show;
  }

  const createHolders = jp.query(old, '$..[?(@.createdDate)]');
  for (let i = 0; i < createHolders.length; i++) {
    delete createHolders[i].creationDate;
  }

  const createdByHolders = jp.query(old, '$..[?(@.createdBy)]');
  for (let i = 0; i < createdByHolders.length; i++) {
    delete createdByHolders[i].createdBy;
  }

  const modifyHolders = jp.query(old, '$..[?(@.modifiedDate)]');
  for (let i = 0; i < modifyHolders.length; i++) {
    delete modifyHolders[i].lastModifiedDate;
  }

  const modifiedByHolders = jp.query(old, '$..[?(@.modifiedBy)]');
  for (let i = 0; i < modifiedByHolders.length; i++) {
    delete modifiedByHolders[i].modifiedBy;
  }

  const intVersionHolders = jp.query(old, '$..[?(@.internalVersion)]');

  for (let i = 0; i < intVersionHolders.length; i++) {
    delete intVersionHolders[i].internalVersion;
  }

  delete old['createdDate'];
  delete old['createdBy'];
  delete old['modifiedBy'];
  delete old['modifiedDate'];
  delete old['internalVersion'];
  delete old['$$update'];
  delete old['_self'];

  return old;
}
