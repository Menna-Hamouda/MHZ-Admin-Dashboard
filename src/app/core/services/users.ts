
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type UserRole = 'Admin' | 'Manager' | 'Employee';
export type UserStatus = 'Active' | 'Blocked';

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  username?: string;
  birthDate?: string;
}

export interface User extends ApiUser {
  role: UserRole;
  status: UserStatus;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
}

interface UsersResponse {
  users: ApiUser[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/users';

  getUsers(): Observable<ApiUser[]> {
    return this.http
      .get<UsersResponse>(`${this.apiUrl}?limit=0`)
      .pipe(map(response => response.users));
  }

  getUserById(id: number): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.apiUrl}/${id}`);
  }

  createUser(payload: UserPayload): Observable<ApiUser> {
    return this.http.post<ApiUser>(
      `${this.apiUrl}/add`,
      payload
    );
  }

  updateUser(
    id: number,
    payload: Partial<UserPayload>
  ): Observable<ApiUser> {
    return this.http.put<ApiUser>(
      `${this.apiUrl}/${id}`,
      payload
    );
  }

  deleteUser(id: number): Observable<ApiUser> {
    return this.http.delete<ApiUser>(`${this.apiUrl}/${id}`);
  }
}
