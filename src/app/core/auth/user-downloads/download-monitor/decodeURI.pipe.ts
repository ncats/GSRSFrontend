import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'decodeUri'
})
export class DecodeUriPipe implements PipeTransform {
  transform(item: string, item2?: string): string {
     return decodeURIComponent(item);
  }
}
