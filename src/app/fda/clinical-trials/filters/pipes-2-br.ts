// https://stackoverflow.com/questions/41563283/how-to-replace-string-in-angular-2
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'pipes2Br'})
export class Pipes2Br implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\|/g, '<br/>');
  }
}
