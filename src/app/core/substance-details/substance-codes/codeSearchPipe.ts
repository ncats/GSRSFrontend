import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'forwardSlash'
})
export class forwardSlash implements PipeTransform {

  transform(value: any): any {
    value = value.replace("/", " ");
    return value;
  }

}
