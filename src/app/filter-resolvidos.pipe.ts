import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterResolvidos',
  pure: false
})
export class FilterResolvidosPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => {
      if (item.dataResolvido === undefined) {
        return false;
      } else {
        return true;
      }
    });
  }
}
