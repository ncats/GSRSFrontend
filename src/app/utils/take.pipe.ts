import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'take'
})
export class TakePipe implements PipeTransform {

  transform(items: Array<any>, num: number): Array<any> {
    console.log(items);
    if (items && items.length && items.length > num) {
      return items.slice(0, num);
    } else {
      return items;
    }
  }

}
