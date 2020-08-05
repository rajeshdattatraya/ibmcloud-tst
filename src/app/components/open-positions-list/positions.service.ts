import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from './../../model/appConfig';

@Injectable({
  providedIn: 'root'
})

export class PositionsService {

  opePositionsUri:string = appConfig.baseUri + '/openPosition/listOpenPositions';
  closePositionsUri:string = appConfig.baseUri + '/openPosition/closePosition';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

constructor(private http: HttpClient) { }




listAllOpenPositions(account, status) {
  let url = `${this.opePositionsUri}/${account}/${status}`;
 
  
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
  )
}



closePositionByID(positionID, positionStatus) {
  let url = `${this.closePositionsUri}/${positionID}/${positionStatus}`;
  
  return this.http.put(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
  )
}


  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
