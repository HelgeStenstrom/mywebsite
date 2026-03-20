import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {WineApi, WineCreate, WineGrape, WineGrapeCreate, WineView} from "../../models/wine.model";
import {handleError} from "./handle-error";

@Injectable({
  providedIn: 'root'
})
export class WineService {

  readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private readonly http: HttpClient) {
  }

  addWine(wine: WineCreate): Observable<void> {

    const url = `${this.apiBase}/wines`;
    const objectObservable: Observable<void> = this.http.post<void>(url, wine);
    return objectObservable.pipe(catchError(handleError));
  }

  getWines(): Observable<WineView[]> {
    const url: string = this.apiBase + '/wines';
    return this.http.get<WineApi[]>(url).pipe(
      map(wines =>
        wines.map(wine => this.toWineView(wine))
      ),
      catchError(handleError)
    );
  }

  getWine(id: number): Observable<WineApi> {
    return this.http.get<WineApi>(`${this.apiBase}/wines/${id}`);
  }

  deleteWine(wine: WineView): Observable<WineView> {
    const url: string = this.apiBase + `/wines/${wine.id}`;

    return this.http.delete<WineView>(url);
  }


  getWineGrapes(wineId: number): Observable<WineGrape[]> {
    const url: string = this.apiBase + `/wines/${wineId}/grapes`;
    return this.http.get<WineGrape[]>(url)
      .pipe(catchError(handleError));
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

  addWineGrape(wineId: number, toCreate: WineGrapeCreate): Observable<WineGrape> {
    const url = `${this.apiBase}/wines/${wineId}/grapes`;
    const objectObservable: Observable<WineGrape> = this.http.post<WineGrape>(url, toCreate);
    return objectObservable.pipe(catchError(handleError));
  }
}
