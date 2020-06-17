import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class PartnerFilterPipe implements PipeTransform {
    transform(items: any[], value: string, prop: string): any[] {
      if (!items) return [];
      if (!value) return items;
      return items.filter(singleItem =>
      singleItem[prop].toLowerCase().startsWith(value.toLowerCase())
      );
  }

}
