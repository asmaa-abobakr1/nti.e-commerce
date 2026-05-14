import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/settings';

  getSettings(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.patch(this.apiUrl, settings);
  }
}
