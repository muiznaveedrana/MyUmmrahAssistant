import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  googleLogin(): void {
    const baseUrl = window.location.origin;
    const redirectUri = `${baseUrl}/auth/callback`;
    
    const params = new URLSearchParams({
      client_id: environment.google.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent'
    });
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  handleAuthCallback(code: string): Observable<User> {
    // Dummy user data
  // const dummyUser: User = {
  //   id: '12345',
  //   name: 'Test User',
  //   email: 'test.user@example.com',
  //   tier: 'premium',
  //   dailyCalls: 0
  // };

  // return of(dummyUser).pipe(
  //   tap(user => {
  //     // Simulate saving the user to local storage and updating the current user subject
  //     localStorage.setItem('user', JSON.stringify(user));
  //     this.currentUserSubject.next(user);
  //   })
  // );
  ///////////////////
    return this.http.post<User>(`${environment.apiUrl}/auth/google/callback`, { code }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}