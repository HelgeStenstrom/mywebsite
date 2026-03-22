import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {
  WineTasting,
  WineTastingCreate,
  WineTastingSummary,
  WineTastingWine,
  WineTastingWineCreate
} from "../../models/tasting.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {handleError} from "./handle-error";

@Injectable({
  providedIn: 'root'
})
export class TastingService {
  public readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private readonly http: HttpClient) {
  }

  createTasting(tasting: WineTastingCreate): Observable<WineTasting> {
    const url = `${this.apiBase}/tastings`;
    return this.http.post<WineTasting>(url, tasting).pipe(catchError(handleError));
  }

  getTasting(id: number): Observable<WineTasting> {

    const url =  `${this.apiBase}/tastings/${id}`;

    return this.http.get<any>(url).pipe( // TODO: Replace any with WineTastingApi
      map(t => ({
        id: t.id,
        title: t.title,
        notes: t.notes,
        tastingDate: t.tastingDate,
        hosts: t.hosts,
        wines: t.wines,
      }))
    );

  }


  addWineToTasting(tastingId: number, wine: WineTastingWineCreate): Observable<WineTastingWine> {
    const url = `${this.apiBase}/tastings/${tastingId}/wines`;
    return this.http.post<WineTastingWine>(url, wine).pipe(catchError(handleError));
  }

  getTastings(): Observable<WineTastingSummary[]> {

    const url = `${this.apiBase}/tastings`;

    return this.http.get<any[]>(url).pipe( // TODO: Replace any[] with WineTastingApi[]
      map(apiTastings =>
        apiTastings.map(t => ({
          id: t.id,
          title: t.title,
          notes: t.notes,
          tastingDate: t.tastingDate,
          hosts: t.hosts,
        }))
      )
    );

  }

  getTastingWines(tastingId: number): Observable<WineTastingWine[]> {
    const url = `${this.apiBase}/tastings/${tastingId}/wines`;

    return this.http.get<WineTastingWine[]>(url).pipe(catchError(handleError));
  }


  deleteTasting(id: number) {
    const url: string = this.apiBase + `/tastings/${id}`;
    return this.http.delete<void>(url);
  }

  deleteWineFromTasting(tastingId: number, wineInTastingId: number) {
    const url: string = this.apiBase + `/tastings/${tastingId}/wines/${wineInTastingId}`;
    return this.http.delete<void>(url);
  }
}
