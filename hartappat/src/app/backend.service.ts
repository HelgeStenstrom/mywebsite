import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private urlBase = 'http://helges-mbp-2:3000/';
  constructor(private http:HttpClient) { }

  // Subject baserat på https://stackoverflow.com/questions/40313770/how-to-trigger-function-from-one-component-to-another-in-angular2
  private grapesSubject: Subject<Grape> = new Subject<Grape>();

  newEvent(event: Grape): void {
    this.grapesSubject.next(event);
  }

  get events () {
    return this.grapesSubject.asObservable();
  }

  addGrape(grape: Grape): Observable<void> {
    const url = `${this.urlBase}grapes`;
    const objectObservable: Observable<void> = this.http.post<void>(url, grape);
    return objectObservable.pipe(catchError(this.handleError));
  }

  deleteGrape(grape: Grape): Observable<Grape> {
    const url: string = this.urlBase + `grapes/${grape.name}`;

    console.log("BackendService.deleteGrape() called with ", grape.name);
    return this.http.delete<Grape>(url);
  }

  getGrapes(): Observable<Grape[]> {
    //console.log('BackendService.getData() called');
    const url: string = this.urlBase + 'grapes';
    return this.http
      .get<Grape[]>(url)
      .pipe(
        catchError(this.handleError)
      )
      ;
  }


  getWines(): Observable<Wine[]> {
    // console.log('BackendService.getData() called');
    const url: string = this.urlBase + 'wines';
    return this.http.get<Wine[]>(url,
      { // Options are not needed in this case; the defaults are OK.
        responseType: 'json',
        observe: 'body',
        reportProgress: false
      });
  }


  patchGrape(from: Grape, to:Grape): Observable<void> {
    const url = `${this.urlBase}grapes`;
    const objectObservable: Observable<void> = this.http.patch<void>(url, {from, to});
    return objectObservable.pipe(catchError(this.handleError));
  }

  validateFile(file: File): Observable<void> {
    console.log('BackendService.validateFile() called');
    return new Observable<void>(observer => observer.complete());
  }

  private handleError(error: HttpErrorResponse): Observable<never> { // From https://angular.io/guide/http#getting-error-details
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
