import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  upgradeToPremium(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/upgrade`, {});
  }

  getDailyUsage(): Observable<{ calls: number, limit: number }> {
    return this.http.get<{ calls: number, limit: number }>(`${this.apiUrl}/usage`);
  }
}