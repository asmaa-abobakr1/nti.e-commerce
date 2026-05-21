import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { User, ApiResponse, Address } from '../models/interfaces';

interface JWTPayload {
  id: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/v1/auth';
  
  private userSubject = new BehaviorSubject<User | JWTPayload | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        this.userSubject.next(decoded);
        this.syncUser();
      } catch (e) {
        this.logout();
      }
    }
  }

  private syncUser() {
    this.getProfile().subscribe({
      next: (res) => {
        const user = res.data.user;
        const current = this.userSubject.value;
        this.userSubject.next({ ...current, ...user } as User);
      },
      error: (err) => {
        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  signup(userData: Partial<User>): Observable<ApiResponse<{ user: User, token: string }>> {
    return this.http.post<ApiResponse<{ user: User, token: string }>>(`${this.apiUrl}/signup`, userData).pipe(
      tap((res) => {
        if ('token' in res) {
           this.setSession((res as any).token);
        } else if (res.data && (res.data as any).token) {
           this.setSession((res.data as any).token);
        }
      })
    );
  }

  login(credentials: any): Observable<ApiResponse<{ user: User, token: string }>> {
    return this.http.post<ApiResponse<{ user: User, token: string }>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        const token = (res as any).token || (res.data as any).token;
        if (token) this.setSession(token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  private setSession(token: string) {
    localStorage.setItem('token', token);
    this.userSubject.next(jwtDecode<JWTPayload>(token));
  }

  getProfile(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>('http://localhost:5000/api/v1/users/me');
  }

  updateProfile(data: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>('http://localhost:5000/api/v1/users/updateMe', data).pipe(
      tap((res) => {
        const current = this.userSubject.value;
        this.userSubject.next({ ...current, ...res.data.user } as User);
      })
    );
  }

  addAddress(address: Partial<Address>): Observable<ApiResponse<{ addresses: Address[] }>> {
    return this.http.post<ApiResponse<{ addresses: Address[] }>>('http://localhost:5000/api/v1/users/address', address);
  }

  deleteAddress(id: string): Observable<ApiResponse<{ addresses: Address[] }>> {
    return this.http.delete<ApiResponse<{ addresses: Address[] }>>(`http://localhost:5000/api/v1/users/address/${id}`);
  }

  setDefaultAddress(id: string): Observable<ApiResponse<{ addresses: Address[] }>> {
    return this.http.patch<ApiResponse<{ addresses: Address[] }>>(`http://localhost:5000/api/v1/users/address/${id}/default`, {});
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.userSubject.value;
    return !!(user && user.role === 'admin');
  }

  getUser(): User | JWTPayload | null {
    return this.userSubject.value;
  }
}
