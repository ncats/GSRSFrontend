import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'facetFilterFda'
})
export class FacetFilterFdaPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      // the need to check the label is why this can't be a more general pipe
      return it.label.toLowerCase().includes(searchText);
    });
  }
}
