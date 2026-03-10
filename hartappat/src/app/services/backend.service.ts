import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../environments/environment";

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

  addWine(wine: WineCreate): Observable<void> {

    const url = `${this.apiBase}/wines`;
    const objectObservable: Observable<void> = this.http.post<void>(url, wine);
    return objectObservable.pipe(catchError(this.handleError));
  }

  addGrape(grape: Grape): Observable<Grape> {
    const url = `${this.apiBase}/grapes`;
    const objectObservable: Observable<Grape> = this.http.post<Grape>(url, grape);
    return objectObservable.pipe(catchError(this.handleError));
  }

  deleteGrape(grape: Grape): Observable<Grape> {
    const url: string = this.apiBase + `/grapes/${grape.id}`;

    return this.http.delete<Grape>(url);
  }


  deleteWineType(id: number) {
    const url: string = this.apiBase + `/wine-types/${id}`;
    return this.http.delete<void>(url);
  }


  deleteCountry(id: number) {
    const url: string = this.apiBase + `/countries/${id}`;
    return this.http.delete<void>(url);
  }


  deleteWine(wine: WineView): Observable<WineView> {
    const url: string = this.apiBase + `/wines/${wine.id}`;

    return this.http.delete<WineView>(url);
  }

  getGrapes(): Observable<Grape[]> {
    const url: string = this.apiBase + '/grapes';
    return this.http
      .get<Grape[]>(url)
      .pipe(
        catchError(this.handleError));
  }

  getCountries(): Observable<CountryApi[]> {
    return this.http
      .get<CountryApi[]>(`${this.apiBase}/countries`)
      .pipe(catchError(this.handleError));
  }

  getWineTypes(): Observable<WineTypeApi[]> {
    return this.http
      .get<WineTypeApi[]>(`${this.apiBase}/wine-types`)
      .pipe(catchError(this.handleError));
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
    };
  }

  patchGrape(id: number, to: Grape): Observable<Grape> {
    const url = `${this.apiBase}/grapes/${id}`;
    const objectObservable: Observable<Grape> = this.http.patch<Grape>(url, to);
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
    return this.http.get<any[]>(url)
      .pipe(
        map(ms => ms
          .map(m => ({given: m.given, surname: m.surname}))),
      );
  }

  getTastings(): Observable<WineTasting[]> {

    const url = `${this.apiBase}/tastings`;

    return this.http.get<WineTastingApi[]>(url).pipe(
      map(apiTastings =>
        apiTastings.map(t => ({
          id: t.id,
          title: t.title,
          notes: t.notes,
          tastingDate: new Date(t.tastingDate),
        }))
      )
    );

  }

  addCountry(name: string) {
    const url = `${this.apiBase}/countries`;
    return this.http.post<CountryApi>(url, {name});
  }

  addWineType(name: string) {
    const url = `${this.apiBase}/wine-types`;
    return this.http.post<WineTypeApi>(url, {name});
  }

  getTastingWines(tastingId: number): Observable<WineTastingWine[]> {
    const url = `${this.apiBase}/tastings/${tastingId}/wines`;

    return this.http.get<WineTastingWine[]>(url).pipe(catchError(this.handleError));
  }
}

export type WineView = {
  id: number;
  name: string;
  country: string;
  wineType: string;
  systembolaget?: number;
  volume?: number;
  createdAt?: string;
  vintage?: string;
};

export type WineCreate = {
  name: string;
  countryId: number;
  wineTypeId: number;
  vintageYear?: number | null;
  isNonVintage?: boolean;
  systembolaget?: number;
  volume?: number;
};

export type WineApi = {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
  };
  wineType: {
    id: number;
    name: string;
  };
  systembolaget?: number;
  volume?: number;
  createdAt?: string;
  vintageYear: number | null;
  isNonVintage: boolean;
};

export type CountryApi = {
  id: number;
  name: string;
  isUsed: boolean;
};

export type WineTypeApi = {
  id: number;
  name: string;
  isUsed: boolean;
};

export type Grape = {
  id: number;
  name: string;
  color: string;
};

export type WineTastingApi = {
  id: number;
  title: string;
  notes?: string;
  tastingDate: string;
}

export type WineTasting = {
  id: number;
  title: string;
  notes?: string;
  tastingDate: Date;
};

export type Member = {
  given: string;
  surname: string;
}

export type WineTastingWine = {
  id: number;
  wineId: number;
  position: number;
  purchasePrice?: number | null;
  averageScore?: number | null;
};

export type WineTastingWineCreate = {
  wineId: number;
  position: number;
  purchasePrice?: number | null;
};
