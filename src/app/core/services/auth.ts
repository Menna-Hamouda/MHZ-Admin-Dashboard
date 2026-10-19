import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import {
  AuthUser,
  LoginResponse,
  UserRole
} from '../models/auth-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://dummyjson.com/auth';

  private readonly currentUserSignal = signal<AuthUser | null>(null);
  private readonly accessTokenSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(
    () => this.currentUserSignal() !== null &&
          this.accessTokenSignal() !== null
  );

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        username: email,
        password,
        expiresInMins: 30
      }
    ).pipe(
      map(response => {
        const user: AuthUser = {
          id: response.id,
          name: `${response.firstName} ${response.lastName}`.trim(),
          email: response.email,
          image: response.image,
          role: this.getDemoRole(response.id)
        };

        return { user, token: response.accessToken };
      }),
      tap(({ user, token }) => {
        this.accessTokenSignal.set(token);
        this.currentUserSignal.set(user);
      }),
      map(result => result.user)
    );
  }

  logout(): void {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);
    void this.router.navigate(['/login']);
  }

  hasRole(allowedRoles: UserRole[]): boolean {
    const user = this.currentUserSignal();

    return !!user && allowedRoles.includes(user.role);
  }

  getToken(): string | null {
    return this.accessTokenSignal();
  }

  private getDemoRole(userId: number): UserRole {
    
    if (userId === 1) {
      return 'Admin';
    }

    if (userId === 2) {
      return 'Manager';
    }

    return 'Employee';
  }
}
