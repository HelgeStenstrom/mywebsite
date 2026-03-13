import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Grape, GrapeCreate} from "../../models/common.model";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {handleError} from "./handle-error";


@Injectable({
  providedIn: 'root'
})
export class GrapeService {

  public readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private readonly http: HttpClient) {}


  addGrape(grape: GrapeCreate): Observable<Grape> {
    const url = `${this.apiBase}/grapes`;
    const objectObservable: Observable<Grape> = this.http.post<Grape>(url, grape);
    return objectObservable.pipe(catchError(handleError));
  }

  getGrapes(): Observable<Grape[]> {
    const url: string = this.apiBase + '/grapes';
    return this.http
      .get<Grape[]>(url)
      .pipe(
        catchError(handleError));
  }

  patchGrape(id: number, to: GrapeCreate): Observable<Grape> {
    const url = `${this.apiBase}/grapes/${id}`;
    const objectObservable: Observable<Grape> = this.http.patch<Grape>(url, to);
    return objectObservable.pipe(catchError(handleError));
  }

  deleteGrape(id:number): Observable<Grape> {
    const url: string = this.apiBase + `/grapes/${id}`;

    return this.http.delete<Grape>(url);
  }


}
