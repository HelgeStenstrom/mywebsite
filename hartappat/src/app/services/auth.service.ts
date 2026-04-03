import {Injectable, signal} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthUser} from "../models/auth-user.model";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly apiBase = environment.apiUrl + '/api/v1';
  currentUser = signal<AuthUser | null>(null);

  constructor(private readonly http: HttpClient) {
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${this.apiBase}/auth/login`, {email, password})
      .pipe(tap(user => this.currentUser.set(user)));
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiBase}/auth/logout`, {})
      .pipe(
        tap(() => this.currentUser.set(null))
      );
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiBase}/auth/me`);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/change-password`, {currentPassword, newPassword});
  }

  fetchCurrentUser(): Observable<AuthUser> {
    return this.me().pipe(
      tap(user => this.currentUser.set(user))
    );
  }}
