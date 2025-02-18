import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'inchiLinebreak'
  })
  export class InchiLinebreakPipe implements PipeTransform {
    transform(inchi: string): string {
      return inchi.replace(/\|/g, '<br/><br/>');
    }
  }