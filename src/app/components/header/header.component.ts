import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <a routerLink="/" class="text-xl font-bold">AI SaaS Platform</a>
          
          <div class="flex items-center gap-4">
            <ng-container *ngIf="auth.currentUser$ | async as user">
              <a routerLink="/dashboard" class="hover:text-blue-600">Dashboard</a>
              <a routerLink="/chat" class="hover:text-blue-600">Chat</a>
              <a routerLink="/subscription" class="hover:text-blue-600">
                {{ user.tier === 'premium' ? 'Premium' : 'Upgrade' }}
              </a>
              <button (click)="auth.logout()" class="text-red-600 hover:text-red-800">
                Logout
              </button>
            </ng-container>
            
            <button *ngIf="!(auth.currentUser$ | async)" 
                    (click)="auth.googleLogin()"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sign in with Google
            </button>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}