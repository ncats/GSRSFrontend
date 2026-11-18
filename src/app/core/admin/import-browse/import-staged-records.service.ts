import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';

/**
 * Owns the staged-record fetch + cross-reference matching logic for
 * ImportBrowseComponent. Scoped per component instance via
 * `providers: [ImportStagedRecordsService]`, not root, since the matching
 * results are per-page-instance, not app-wide state.
 */
@Injectable()
export class ImportStagedRecordsService {

  constructor(private adminService: AdminService) {
  }

  // Fetches one staged record by id and resolves its cross-reference matches
  // against GSRS/Staging Area sources. Mutates the passed idMapping (matching
  // the original component behavior) rather than returning a new mapping.
  getRecord(id: string, idMapping: Array<any>, demoResp: any): Observable<any> {
    const subject = new Subject<string>();
    let ids = [];
    let sources = [];
    this.adminService.GetStagedRecord(id).subscribe(response => {
      idMapping[response.uuid] = id;
      response._matches.matches.forEach(match => {
        match.matchingRecords.forEach(matchRec => {
          if (matchRec.sourceName == 'GSRS' || matchRec.sourceName == 'Staging Area') {
            if (!ids[matchRec.recordId.idString]) {
              ids[matchRec.recordId.idString] = [matchRec.matchedKey];
              sources[matchRec.recordId.idString] = matchRec.sourceName;
            } else {
              ids[matchRec.recordId.idString].push(matchRec.matchedKey);
              sources[matchRec.recordId.idString] = matchRec.sourceName;

            }
          }

        });
      });
      let items = [];
      Object.keys(ids).forEach(key => {
        let temp = {'ID':key,
                    'records':ids[key],
                     'source':sources[key]
                  };
                    items.push(temp);
      });
      response.matchedRecords = items;
      subject.next(response);

    }, error => {
      idMapping[demoResp.uuid] = id;
      let response = JSON.parse(JSON.stringify(demoResp));
      response._matches.matches.forEach(match => {
        match.matchingRecords.forEach(matchRec => {
          if (!ids[matchRec.recordId.idString]) {
            ids[matchRec.recordId.idString] = [matchRec.matchedKey];
          } else {
            ids[matchRec.recordId.idString].push(matchRec.matchedKey);

          }
        });
      });
      let items = [];
      Object.keys(ids).forEach(key => {
        let temp = {'ID':key,
                    'records':ids[key]};
                    items.push(temp);
      });

      response.matchedRecords = items;
      subject.next(response);

    });
    return subject.asObservable();
  }

  // Mutates each record with a `matchedRecords` map built from its own
  // _matches.matches, and also returns the flat matches array the original
  // component field held.
  organizeMatches(records: Array<any>): Array<any> {
    const matches = [];
    records.forEach(record => {
      let ids = [];
      record._matches.matches.forEach(match => {
        match.matchingRecords.forEach(matchRec => {
          if (!ids[matchRec]) {
            ids[matchRec] = [matchRec.matchedKey];
          } else {
            ids[matchRec].push(matchRec.matchedKey);
          }
        });
      });
      record.matchedRecords = ids;
    });
    return matches;
  }
}
