import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/auth';
  
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userSubject.next(jwtDecode(token));
    }
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      tap((res: any) => this.setSession(res.token))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => this.setSession(res.token))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  private setSession(token: string) {
    localStorage.setItem('token', token);
    this.userSubject.next(jwtDecode(token));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.userSubject.value;
    return user && user.role === 'admin';
  }
}
