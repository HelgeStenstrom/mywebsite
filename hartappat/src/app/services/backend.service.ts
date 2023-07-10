import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { interval, Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public readonly urlBase = 'http://localhost:3000/';
  //public readonly urlBase = 'http://helges-mbp-2:3000/';
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

  addWine(wine: Wine) {
    console.log("BackendService.addWine(wine) called");
    throw new Error();
  }

  addGrape(grape: Grape): Observable<void> {
    const url = `${this.apiBase}grapes`;
    const objectObservable: Observable<void> = this.http.post<void>(url, grape);
    return objectObservable.pipe(catchError(this.handleError));
  }

  deleteGrape(grape: Grape): Observable<Grape> {
    const url: string = this.apiBase + `grapes/${grape.name}`;

    return this.http.delete<Grape>(url);
  }


  getGrapes(): Observable<Grape[]> {
    const url: string = this.apiBase + 'grapes';
    return this.http
      .get<Grape[]>(url)
      .pipe(catchError(this.handleError));
  }


  getWines(): Observable<Wine[]> {
    const url: string = this.apiBase + 'wines';
    return this.http.get<Wine[]>(url,
      { // Options are not needed in this case; the defaults are OK.
        responseType: 'json',
        observe: 'body',
        reportProgress: false
      })
      .pipe(
        catchError(this.handleError)
      )
      ;
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

  getMembers$(): Observable<Member[]> {
    const url = `${this.apiBase}members`;
    const observable1: Observable<Member[]> = this.http.get<any[]>(url)
      .pipe(
        map(ms => ms
          .map(m => ({given: m.Förnamn, surname: m.Efternamn}))),
      );
    return observable1;
  }

  getMembersExample(): Observable<Member[]>{
    return interval(500)
      .pipe(map(() => [{given: 'Adam', surname:'Nescio'}, {given: 'Bertil', surname:'Bbb'}]));
  }

  getTastings() : Observable<Tasting[]>{

    const url = `${this.apiBase}vinprovning`;
    return this.http.get<Tasting[]>(url);

  }
}

export type Wine = {
  name: string;
  country: string;
  category: string;
  systembolaget: number | undefined;
};

export type Grape = {
  name: string;
  color: string;
};

export type Tasting = {
  title: string;
  notes: string;
  date: string;
}

export type Member = {
  given: string;
  surname: string;
}
