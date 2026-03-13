import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {CountryApi} from "../../models/common.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {handleError} from "./handle-error";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  public readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private http: HttpClient) {
  }

  addCountry(name: string) {
    const url = `${this.apiBase}/countries`;
    return this.http.post<CountryApi>(url, {name});
  }

  getCountries(): Observable<CountryApi[]> {
    return this.http
      .get<CountryApi[]>(`${this.apiBase}/countries`)
      .pipe(catchError(handleError));
  }

  deleteCountry(id: number) {
    const url: string = this.apiBase + `/countries/${id}`;
    return this.http.delete<void>(url);
  }


}
