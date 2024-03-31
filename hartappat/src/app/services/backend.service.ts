import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public readonly apiBase = environment.apiUrl + '/api/v1';

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

  addWine(wine: Wine):  Observable<void> {

    const url = `${this.apiBase}/wines`;
    console.log(`BackendService.addWine: ${wine.name}. url = ${url}`)
    const objectObservable: Observable<void> = this.http.post<void>(url, wine);
    return objectObservable.pipe(catchError(this.handleError));
  }

  addGrape(grape: Grape): Observable<void> {
    const url = `${this.apiBase}/grapes`;
    const objectObservable: Observable<void> = this.http.post<void>(url, grape);
    return objectObservable.pipe(catchError(this.handleError));
  }

  deleteGrape(grape: Grape): Observable<Grape> {
    const url: string = this.apiBase + `/grapes/${grape.name}`;

    return this.http.delete<Grape>(url);
  }


  getGrapes(): Observable<Grape[]> {
    const url: string = this.apiBase + '/grapes';
    return this.http
      .get<Grape[]>(url)
      .pipe(
        // Genom att aktivera raden nedan, kan man enkelt verifiera att ett UT verkligen testar
        //map(gs => gs.map((g: Grape) => ({name: 'Not ' + g.name + '?', color: g.color}))),
        // Så länge fördröjningen är mindre än 5 sekunder (Jasmine default väntetid), så verkar unit test fungera.
        //delay(4900),
        catchError(this.handleError));
  }


  getWines(): Observable<Wine[]> {
    const url: string = this.apiBase + '/wines';
    return this.http
      .get<Wine[]>(url)
      .pipe(
        catchError(this.handleError)
      )
      ;
  }

  patchGrape(from: Grape, to:Grape): Observable<void> {
    const url = `${this.apiBase}/grapes`;
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
    const url = `${this.apiBase}/members`;
    const observable1: Observable<Member[]> = this.http.get<any[]>(url)
      .pipe(
        map(ms => ms
          .map(m => ({given: m.Förnamn, surname: m.Efternamn}))),
      );
    return observable1;
  }

  getTastings() : Observable<Tasting[]>{

    const url = `${this.apiBase}/tasting`;
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
