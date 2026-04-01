import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/login`, {email, password});
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/logout`, {});
  }

  me(): Observable<any>  {
    return this.http.get(`${this.apiBase}/auth/me`);
  }
}
