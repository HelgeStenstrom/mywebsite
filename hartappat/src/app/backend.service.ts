import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public readonly urlBase = 'http://helges-mbp-2:3000/';
  private apiBase = this.urlBase + 'api/v1/';

  /**
   * Subject baserat på https://stackoverflow.com/questions/40313770/how-to-trigger-function-from-one-component-to-another-in-angular2
   */
  private grapesSubject: Subject<Grape> = new Subject<Grape>();
  constructor(private http:HttpClient) { }

  newEvent(event: Grape): void {
    this.grapesSubject.next(event);
  }

  get events () {
    return this.grapesSubject.asObservable();
  }

  addGrape(grape: Grape): Observable<void> {
    const url = `${this.apiBase}grapes`;
    const objectObservable: Observable<void> = this.http.post<void>(url, grape);
    return objectObservable.pipe(catchError(this.handleError));
  }

  deleteGrape(grape: Grape): Observable<Grape> {
    const url: string = this.apiBase + `grapes/${grape.name}`;

    console.log("BackendService.deleteGrape() called with ", grape.name);
    return this.http.delete<Grape>(url);
  }


  getGrapes(): Observable<Grape[]> {
    // console.log('BackendService.getGrapes() called');
    const url: string = this.apiBase + 'grapes';
    return this.http
      .get<Grape[]>(url)
      .pipe(catchError(this.handleError));
  }


  getWines(): Observable<Wine[]> {
    // console.log('BackendService.getWines() called');
    const url: string = this.apiBase + 'wines';
    return this.http.get<Wine[]>(url,
      { // Options are not needed in this case; the defaults are OK.
        responseType: 'json',
        observe: 'body',
        reportProgress: false
      });
  }

  patchGrape(from: Grape, to:Grape): Observable<void> {
    const url = `${this.apiBase}grapes`;
    const objectObservable: Observable<void> = this.http.patch<void>(url, {from, to});
    return objectObservable.pipe(catchError(this.handleError));
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

  getTastings() : Observable<Tasting[]>{

    const url = `${this.apiBase}vinprovning`;
    return this.http.get<Tasting[]>(url);

    // const observable = new Observable<Tasting>((subscriber) => {
    //   const value: Tasting = {title: 'En provning som kommer från backend.service.ts', notes: 'lite text om den'};
    //   subscriber.next(value);
    // });
    //
    // return observable;

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

export type Tasting = {
  title: string;
  notes: string;
}
