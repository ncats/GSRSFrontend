import {Pipe, PipeTransform} from '@angular/core';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Pipe({
  name: 'codeSystemDisplay'
})
export class CodeSystemDisplayPipe implements PipeTransform {
    constructor(public cvService: ControlledVocabularyService) {

    }
  transform(name: string, item2?: string): any {
    return this.cvService.getDomainVocabulary('CODE_SYSTEM').pipe(map(response => {
            let resp;
            resp = response['CODE_SYSTEM'].dictionary;
            if (resp[name]) {
                return resp[name].display;
            } else {
                return name;
            }
        }));
}
}
