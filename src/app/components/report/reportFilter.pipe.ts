import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportFilter'
})
export class ReportFilterPipe implements PipeTransform {
    transform(reportData: any[],fromDate:String,toDate:String,jrss:String): any[] {
      console.log('inside the report filter fromDate',fromDate)
      console.log('inside the report filter toDate',toDate)
      console.log('inside the report filter jrss',jrss)

	  
    //  if (!items) return [];
      if (!fromDate && !toDate && !jrss) return reportData;
      //return items.filter(singleItem => {
	  console.log('****reportData****',reportData)
	 
      //singleItem[prop].toLowerCase().startsWith(value.toLowerCase())
      //});
  }

}
