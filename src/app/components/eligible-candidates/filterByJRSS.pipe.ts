import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByJRSS'
})
export class EligibleCandidatesFilterPipe implements PipeTransform {
  
  
    transform(items: any[], value: String ): any[] {
      
      if (!items) return [];
      if (!value) return items;
       return items.filter(singleItem => 
      singleItem.result_users[0].JRSS.toLowerCase() == value.toLowerCase() );
  }

}
