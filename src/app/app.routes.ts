import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./pages/auth/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    //canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () => 
      import('./pages/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'subscription',
    loadComponent: () => 
      import('./pages/subscription/subscription.component').then(m => m.SubscriptionComponent),
    canActivate: [AuthGuard]
  }
];