import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/messages';

  sendMessage(messageData: Partial<Message>): Observable<ApiResponse<{ message: Message }>> {
    return this.http.post<ApiResponse<{ message: Message }>>(this.apiUrl, messageData);
  }

  getMessages(): Observable<ApiResponse<{ messages: Message[] }>> {
    return this.http.get<ApiResponse<{ messages: Message[] }>>(this.apiUrl);
  }

  markAsRead(id: string): Observable<ApiResponse<{ message: Message }>> {
    return this.http.patch<ApiResponse<{ message: Message }>>(`${this.apiUrl}/${id}/read`, {});
  }

  deleteMessage(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
