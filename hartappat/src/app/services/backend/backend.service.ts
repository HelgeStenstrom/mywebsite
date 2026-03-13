import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";

import {WineApi, WineCreate, WineView} from "../../models/wine.model";
import {
  WineTasting,
  WineTastingApi,
  WineTastingCreate,
  WineTastingSummary,
  WineTastingWine
} from '../../models/tasting.model';

import {CountryApi, Grape, Member, WineTypeApi} from '../../models/common.model';


export type { WineView, WineApi, WineCreate } from '../../models/wine.model';
export type {WineTasting, WineTastingSummary, WineTastingWine, WineTastingApi, WineTastingHost, WineTastingCreate, WineTastingWineCreate} from '../../models/tasting.model';
export type {CountryApi, WineTypeApi, Grape, Member} from '../../models/common.model';



@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public readonly apiBase = environment.apiUrl + '/api/v1';

  /**
   * Subject baserat på https://stackoverflow.com/questions/40313770/how-to-trigger-function-from-one-component-to-another-in-angular2
   */
  private grapesSubject: Subject<Grape> = new Subject<Grape>();

  constructor(private http: HttpClient) {
  }

  newEvent(event: Grape): void {
    this.grapesSubject.next(event);
  }

  get events() {
    return this.grapesSubject.asObservable();
  }


  addGrape(grape: Grape): Observable<Grape> {
    const url = `${this.apiBase}/grapes`;
    const objectObservable: Observable<Grape> = this.http.post<Grape>(url, grape);
    return objectObservable.pipe(catchError(this.handleError));
  }

  getGrapes(): Observable<Grape[]> {
    const url: string = this.apiBase + '/grapes';
    return this.http
      .get<Grape[]>(url)
      .pipe(
        catchError(this.handleError));
  }

  patchGrape(id: number, to: Grape): Observable<Grape> {
    const url = `${this.apiBase}/grapes/${id}`;
    const objectObservable: Observable<Grape> = this.http.patch<Grape>(url, to);
    return objectObservable.pipe(catchError(this.handleError));
  }

  deleteGrape(grape: Grape): Observable<Grape> {
    const url: string = this.apiBase + `/grapes/${grape.id}`;

    return this.http.delete<Grape>(url);
  }

  createTasting(tasting: WineTastingCreate): Observable<WineTasting> {
    const url = `${this.apiBase}/tastings`;
    return this.http.post<WineTasting>(url, tasting).pipe(catchError(this.handleError));
  }

  getTasting(id: number): Observable<WineTasting> {

    const url =  `${this.apiBase}/tastings/${id}`;

    return this.http.get<WineTastingApi>(url).pipe(
      map(t => ({
        id: t.id,
        title: t.title,
        notes: t.notes,
        tastingDate: new Date(t.tastingDate),
        hosts: t.hosts,
        wines: t.wines,
      }))
    );

  }



  getTastings(): Observable<WineTastingSummary[]> {

    const url = `${this.apiBase}/tastings`;

    return this.http.get<WineTastingApi[]>(url).pipe(
      map(apiTastings =>
        apiTastings.map(t => ({
          id: t.id,
          title: t.title,
          notes: t.notes,
          tastingDate: new Date(t.tastingDate),
          hosts: t.hosts,
        }))
      )
    );

  }

  getTastingWines(tastingId: number): Observable<WineTastingWine[]> {
    const url = `${this.apiBase}/tastings/${tastingId}/wines`;

    return this.http.get<WineTastingWine[]>(url).pipe(catchError(this.handleError));
  }

  addWine(wine: WineCreate): Observable<void> {

    const url = `${this.apiBase}/wines`;
    const objectObservable: Observable<void> = this.http.post<void>(url, wine);
    return objectObservable.pipe(catchError(this.handleError));
  }

  deleteWine(wine: WineView): Observable<WineView> {
    const url: string = this.apiBase + `/wines/${wine.id}`;

    return this.http.delete<WineView>(url);
  }

  getWine(id: number): Observable<WineApi> {
   return this.http.get<WineApi>(`${this.apiBase}/wines/${id}`);
  }

  getWines(): Observable<WineView[]> {
    const url: string = this.apiBase + '/wines';
    return this.http.get<WineApi[]>(url).pipe(
      map(wines =>
        wines.map(wine => this.toWineView(wine))
      ),
      catchError(this.handleError)
    );
  }


  private toWineView(wine: WineApi): WineView {
    const maybeVintage = wine.vintageYear
      ? wine.vintageYear.toString()
      : undefined;
    return {
      id: wine.id,
      name: wine.name,
      country: wine.country.name,
      wineType: wine.wineType.name,
      systembolaget: wine.systembolaget,
      volume: wine.volume,
      createdAt: wine.createdAt,
      vintage: wine.isNonVintage
        ? 'NV'
        : maybeVintage,
      isUsed: wine.isUsed,
    };
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


