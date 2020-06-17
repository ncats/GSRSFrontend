import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'namesDisplayOrder'
})
export class NamesDisplayPipe implements PipeTransform {
  transform(names: Array<any>): Array<any> {
    names = names.slice().sort((a, b) => {
        let returned = -1;
        if ( b.displayName === true) {
          returned = 1;
        } else if (b.preferred === true && a.displayName !== true) {
          returned = 1;
        }
        return returned;
    });
     return names.slice(0, 4);
  }
}
