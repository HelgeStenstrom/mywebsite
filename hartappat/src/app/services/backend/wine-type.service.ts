import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {WineTypeApi} from "../../models/common.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {handleError} from "./handle-error";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class WineTypeService {
  public readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private readonly http: HttpClient) {
  }

  addWineType(name: string) {
    const url = `${this.apiBase}/wine-types`;
    return this.http.post<WineTypeApi>(url, {name});
  }

  getWineTypes(): Observable<WineTypeApi[]> {
    return this.http
      .get<WineTypeApi[]>(`${this.apiBase}/wine-types`)
      .pipe(catchError(handleError));
  }

  deleteWineType(id: number) {
    const url: string = this.apiBase + `/wine-types/${id}`;
    return this.http.delete<void>(url);
  }
}
