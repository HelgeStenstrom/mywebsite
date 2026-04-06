import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {
  WineTasting,
  WineTastingCreate,
  WineTastingSummary,
  WineTastingWine,
  WineTastingWineCreate,
  WineTastingWineUpdate
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
          winningWines: t.winningWines,
        }))
      )
    );

  }

  deleteTasting(id: number) {
    const url: string = this.apiBase + `/tastings/${id}`;
    return this.http.delete<void>(url);
  }

  deleteWineFromTasting(tastingId: number, wineInTastingId: number) {
    const url: string = this.apiBase + `/tastings/${tastingId}/wines/${wineInTastingId}`;
    return this.http.delete<void>(url);
  }

  patchWineInTasting(tastingId: number, wineInTastingId: number, update: WineTastingWineUpdate) {
    const url: string = this.apiBase + `/tastings/${tastingId}/wines/${wineInTastingId}`;
    return this.http.patch<void>(url, update);
  }

  putWinePositions(tastingId: number, positions: { id: number, position: number|null }[]): Observable<void> {
    const url = `${this.apiBase}/tastings/${tastingId}/wines/positions`;
    return this.http.put<void>(url, positions).pipe(catchError(handleError));
  }

  patchTasting(id: number, data: Partial<WineTastingCreate>): Observable<WineTasting> {
    const url = `${this.apiBase}/tastings/${id}`;
    return this.http.patch<WineTasting>(url, data).pipe(catchError(handleError));
  }

  putHosts(tastingId: number, memberIds: number[]): Observable<void> {
    const url = `${this.apiBase}/tastings/${tastingId}/hosts`;
    return this.http.put<void>(url, memberIds.map(id => ({ memberId: id }))).pipe(catchError(handleError));
  }

}
