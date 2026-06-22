import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Api } from './api';
import { AuthResponse, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly tokenKey = 'spv_token';
  private readonly userKey = 'spv_user';
  private readonly userSubject = new BehaviorSubject<User | null>(this.readUser());

  readonly user$ = this.userSubject.asObservable();

  constructor(private api: Api) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.api.login(username, password).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.userSubject.next(response.user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  private readUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
