import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/testimonials';

  submit(testimonial: any): Observable<any> {
    return this.http.post(this.apiUrl, testimonial);
  }

  getApproved(): Observable<any> {
    return this.http.get(`${this.apiUrl}/approved`);
  }

  // Admin
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateStatus(id: string, statusData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, statusData);
  }
}
