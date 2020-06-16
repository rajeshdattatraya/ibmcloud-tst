import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class DashboardFilterPipe implements PipeTransform {
    transform(items: any[], value: string, prop: string): any[] {
      console.log('here in pipe of transform',items,value)
      if (!items) return [];
      if (!value) return items;
      return items.filter(singleItem =>
      singleItem[prop].toLowerCase().startsWith(value.toLowerCase())
      );
  }

}
