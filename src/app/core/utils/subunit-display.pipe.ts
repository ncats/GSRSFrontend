import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'subunitDisplay',
    standalone: false
})
export class SubunitDisplayPipe implements PipeTransform {
  transform(item: string, item2?: string): string {
     return item.replace(/[^a-z0-9]+/gi, '').replace(/(.{10})/g, '$1       ');
  }
}
