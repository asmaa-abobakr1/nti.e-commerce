import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Testimonial, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/testimonials';

  submit(testimonial: Partial<Testimonial>): Observable<ApiResponse<{ testimonial: Testimonial }>> {
    return this.http.post<ApiResponse<{ testimonial: Testimonial }>>(this.apiUrl, testimonial);
  }

  getApproved(): Observable<ApiResponse<{ testimonials: Testimonial[] }>> {
    return this.http.get<ApiResponse<{ testimonials: Testimonial[] }>>(`${this.apiUrl}/approved`);
  }

  
  getAll(): Observable<ApiResponse<{ testimonials: Testimonial[] }>> {
    return this.http.get<ApiResponse<{ testimonials: Testimonial[] }>>(this.apiUrl);
  }

  updateStatus(id: string, statusData: { isApproved: 1 | 2 | 3 }): Observable<ApiResponse<{ testimonial: Testimonial }>> {
    return this.http.patch<ApiResponse<{ testimonial: Testimonial }>>(`${this.apiUrl}/${id}/status`, statusData);
  }
}
