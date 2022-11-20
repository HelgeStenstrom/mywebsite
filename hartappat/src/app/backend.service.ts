import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  urlBase = 'http://helges-mbp-2:3000/';

  constructor(private http:HttpClient) { }

  getWines(): Observable<Wine[]> {
    console.log('BackendService.getData() called');
    const url: string = this.urlBase + 'wines';
    return this.http.get<Wine[]>(url,
      { // Options are not needed in this case; the defaults are OK.
        responseType: 'json',
        observe: 'body',
        reportProgress: false
      });
  }

   getGrapes(): Observable<Grape[]> {
     console.log('BackendService.getData() called');
     const url: string = this.urlBase + 'grapes';
     return this.http
       .get<Grape[]>(url)
       .pipe(
         catchError(this.handleError)
       )
       ;
  }

  addGrape(grape: Grape): Observable<void> {
    const url = `${this.urlBase}g3`;
// ?name=${grape.name}&color=${grape.color}
    console.log("Adding a grape: ", grape, url);

    const  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    // const httpOptions = {'Content-Type': 'application/json'};

    const objectObservable: Observable<void> = this.http.post<void>(url, grape);
    const objectObservable1: Observable<void> = objectObservable.pipe(catchError(this.handleError));
    return objectObservable1;
  }


  addGrape2(grape: Grape): Observable<void> {
    const url = `${this.urlBase}g3`;
// ?name=${grape.name}&color=${grape.color}
    console.log("Test: Adding a grape: ", grape, url);

    const  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    // const httpOptions = {'Content-Type': 'application/json'};
    const body = grape;

    //const objectObservable: Observable<void> = this.http.post<void>(url, grape, httpOptions);
    const objectObservable: Observable<void> = this.http.post<void>(url, grape);
    const objectObservable1: Observable<void> = objectObservable.pipe(catchError(this.handleError));
    return objectObservable1;
  }

  private handleError(error: HttpErrorResponse) { // From https://angular.io/guide/http#getting-error-details
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}

export type Wine = {
  name: string;
  country: string;
  category: string;
  systembolaget: number
};

export type Grape = {
  name: string;
  color: string;
};
