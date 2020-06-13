import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(input: number): string {
    if ( isNaN( parseFloat( String(input)))) {
        return input.toString();
    }

    const order = [' B', ' KB', ' MB', ' GB', ' TB', ' PB'];

    let index = 0;

    while (input >= 1024 && index < 5) {
        input = input / 1024;
        index++;
    }

    return input.toFixed(2) + order[index];
    }
}
