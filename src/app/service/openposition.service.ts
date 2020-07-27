import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from './../model/appConfig';

@Injectable({
  providedIn: 'root'
})
export class OpenPositionService {

 baseUri:string = appConfig.baseUri + '/openPosition';
 baseLOBUri:string = appConfig.baseUri + '/lob';
 baseCompetencyLevelUri:string = appConfig.baseUri + '/competencyLevel';
 basePositionLocationUri:string = appConfig.baseUri + '/positionLocation';
 baseRateCardJobRoleUri:string = appConfig.baseUri + '/rateCardJobRole';
 headers = new HttpHeaders().set('Content-Type', 'application/json');

 constructor(private http: HttpClient) { }

    // Create Open Position
    createOpenPosition(data): Observable<any> {
      let url = `${this.baseUri}/createOpenPosition`;
      return this.http.post(url, data)
        .pipe(
          catchError(this.errorMgmt)
        )
    }

    // Get all Open Positions
    getAllOpenPositions() {
      return this.http.get(`${this.baseUri}`);
    }

    readOpenPositionByPositionName(name): Observable<any> {
       let url = `${this.baseUri}/readOpenPositionByPositionName/${name}`;
       return this.http.get(url, {headers: this.headers}).pipe(
         map((res: Response) => {
           return res || {}
         }),
         catchError(this.errorMgmt)
       )
    }

    // Read Open Position
    readOpenPosition(id): Observable<any> {
      let url = `${this.baseUri}/readOpenPosition/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
    }

    // Update Open Position
    updateOpenPosition(id, data): Observable<any> {
      let url = `${this.baseUri}/updateOpenPosition/${id}`;
      return this.http.put(url, data, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      )
    }

    // Delete Open Position
    deleteOpenPosition(id): Observable<any> {
      let url = `${this.baseUri}/deleteOpenPosition/${id}`;
      return this.http.delete(url, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      )
    }

    // Get all competency levels
     getCompetencyLevels() {
       return this.http.get(`${this.baseCompetencyLevelUri}`);
     }

    // Get all position locations
     getPositionLocations() {
       return this.http.get(`${this.basePositionLocationUri}`);
     }

     // Get all rate card job roles
      getRateCardJobRoles() {
        return this.http.get(`${this.baseRateCardJobRoleUri}`);
      }

     // Get all LineOfBusiness
     getLineOfBusiness() {
       return this.http.get(`${this.baseLOBUri}`);
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
