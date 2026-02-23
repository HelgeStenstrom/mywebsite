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
  constructor(private http:HttpClient) { }

  newEvent(event: Grape): void {
    this.grapesSubject.next(event);
  }

  get events () {
    return this.grapesSubject.asObservable();
  }

  addWine(wine: WineView):  Observable<void> {

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
    const url: string = this.apiBase + `/grapes/${grape.id}`;

    return this.http.delete<Grape>(url);
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
        // Genom att aktivera raden nedan, kan man enkelt verifiera att ett UT verkligen testar
        //map(gs => gs.map((g: Grape) => ({name: 'Not ' + g.name + '?', color: g.color}))),
        // Så länge fördröjningen är mindre än 5 sekunder (Jasmine default väntetid), så verkar unit test fungera.
        //delay(4900),
        catchError(this.handleError));
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
    return {
      id: wine.id,
      name: wine.name,
      country: wine.country.name,
      wineType: wine.wineType.name,
      systembolaget: wine.systembolaget,
      volume: wine.volume
    };
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
    return this.http.get<any[]>(url)
      .pipe(
        map(ms => ms
          .map(m => ({given: m.given, surname: m.surname}))),
      );
  }

  getTastings() : Observable<Tasting[]>{

    const url = `${this.apiBase}/tastings`;
    return this.http.get<Tasting[]>(url);

  }
}

export type WineView = {
  id: number;
  name: string;
  country: string;
  wineType: string;
  systembolaget: number | undefined;
  volume: number | undefined;
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
};

export type Grape = {
  id: number;
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
