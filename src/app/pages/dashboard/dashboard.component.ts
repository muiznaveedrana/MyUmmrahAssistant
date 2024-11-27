import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4">Welcome, {{ user?.name || 'User' }}</h2>
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Subscription Tier</h3>
            <p class="capitalize">{{ user?.tier || 'free' }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">API Calls Today</h3>
            <p>{{ user?.dailyCalls || 0 }} / {{ (user?.tier || 'free') === 'premium' ? '∞' : '20' }}</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Status</h3>
            <p>{{ ((user?.dailyCalls || 0) >= 20 && (user?.tier || 'free') === 'free') ? 'Limit Reached' : 'Active' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Recent Queries</h2>
        <div class="space-y-4">
          <ng-container *ngIf="recentChats.length > 0; else noChats">
            <div *ngFor="let chat of recentChats" class="border-b pb-4">
              <p class="font-medium">{{ chat.message }}</p>
              <p class="text-gray-600">{{ chat.response }}</p>
              <p class="text-sm text-gray-400">{{ chat.createdAt | date:'medium' }}</p>
            </div>
          </ng-container>
          <ng-template #noChats>
            <p class="text-gray-500 italic">No recent queries found.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  recentChats: any[] = [];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.loadRecentChats();
  }

  loadRecentChats() {
    this.chatService.getChatHistory().subscribe({
      next: (chats) => {
        this.recentChats = chats.slice(0, 5); // Show only 5 most recent chats
      },
      error: (error) => {
        console.error('Error loading recent chats:', error);
      }
    });
  }
}