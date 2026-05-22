import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/users';

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  addAddress(address: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/address`, address);
  }

  setDefaultAddress(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/address/${id}/default`, {});
  }
  
  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/address/${id}`);
  }

  
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
