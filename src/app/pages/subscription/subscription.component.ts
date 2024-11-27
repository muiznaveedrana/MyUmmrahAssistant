import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-8">Choose Your Plan</h2>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">Free Tier</h3>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              20 API calls per day
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Basic AI responses
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Standard support
            </li>
          </ul>
          <p class="text-2xl font-bold mb-4">$0 <span class="text-sm font-normal">/month</span></p>
          <button
            class="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            [disabled]="(auth.currentUser$ | async)?.tier === 'free'"
          >
            Current Plan
          </button>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-2 border-blue-600">
          <h3 class="text-xl font-semibold mb-4">Premium Tier</h3>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Unlimited API calls
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Advanced AI capabilities
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Priority support
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Custom integrations
            </li>
          </ul>
          <p class="text-2xl font-bold mb-4">$49 <span class="text-sm font-normal">/month</span></p>
          <button
            (click)="upgradeToPremium()"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            [disabled]="(auth.currentUser$ | async)?.tier === 'premium'"
          >
            {{ (auth.currentUser$ | async)?.tier === 'premium' ? 'Current Plan' : 'Upgrade Now' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class SubscriptionComponent {
  constructor(
    public auth: AuthService,
    private userService: UserService
  ) {}

  upgradeToPremium() {
    this.userService.upgradeToPremium().subscribe({
      next: () => {
        // Refresh user data after upgrade
        this.userService.getCurrentUser().subscribe();
      },
      error: (error) => {
        console.error('Error upgrading to premium:', error);
      }
    });
  }
}