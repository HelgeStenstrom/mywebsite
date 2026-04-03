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

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiBase}/auth/login`, {email, password})
      .pipe(tap(user => this.currentUser.set(user as AuthUser)));
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiBase}/auth/logout`, {})
      .pipe(
        tap(() => this.currentUser.set(null))
      );
  }

  me(): Observable<any> {
    return this.http.get(`${this.apiBase}/auth/me`);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/change-password`, {currentPassword, newPassword});
  }

  fetchCurrentUser(): Observable<any> {
    return this.me().pipe(
      tap(user => this.currentUser.set(user as AuthUser))
    );
  }}
