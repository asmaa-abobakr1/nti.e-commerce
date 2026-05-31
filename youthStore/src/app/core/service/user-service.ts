import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Dependency injection
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  /** GET current logged‑in user */
  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  /** GET all users (admin view) */
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /** DELETE a user (soft‑delete) */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** PATCH a user (e.g., toggle role) */
  updateUser(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  /** USER address helpers */
  addAddress(address: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/address`, address);
  }

  setDefaultAddress(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/address/${id}/default`, {});
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/address/${id}`);
  }
}
