import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6">AI-Powered Insights Platform</h1>
      <p class="text-xl mb-8">
        Unlock the power of AI with our advanced RAG agent integration.
        Get instant answers and insights from your data.
      </p>
      
      <div class="space-y-8">
        <div class="grid grid-cols-3 gap-8">
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-4">Smart Queries</h3>
            <p>Advanced AI processing for accurate and relevant responses</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-4">Real-time Chat</h3>
            <p>Interactive conversations with our AI agent</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-4">Usage Analytics</h3>
            <p>Track and monitor your API usage and insights</p>
          </div>
        </div>

        <button *ngIf="!(auth.currentUser$ | async)"
                (click)="auth.googleLogin()"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
          Get Started Free
        </button>
      </div>
    </div>
  `
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}