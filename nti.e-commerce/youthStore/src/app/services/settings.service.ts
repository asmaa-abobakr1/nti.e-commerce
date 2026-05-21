import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Settings, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/settings';

  getSettings(): Observable<ApiResponse<{ settings: Settings }>> {
    return this.http.get<ApiResponse<{ settings: Settings }>>(this.apiUrl);
  }

  updateSettings(settings: FormData): Observable<ApiResponse<{ settings: Settings }>> {
    return this.http.patch<ApiResponse<{ settings: Settings }>>(this.apiUrl, settings);
  }
}
