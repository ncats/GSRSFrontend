import {Pipe, PipeTransform} from '@angular/core';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Pipe({
  name: 'relationshipDisplay'
})
export class RelationshipDisplayPipe implements PipeTransform {
    constructor(public cvService: ControlledVocabularyService) {

    }
  transform(name: string, item2?: string): any {
    return this.cvService.getDomainVocabulary('RELATIONSHIP_TYPE').pipe(map(response => {
            let resp;
            resp = response['RELATIONSHIP_TYPE'].dictionary;
            if (resp[name]) {
                return resp[name].display;
            } else {
                return name;
            }
        }));
}
}
