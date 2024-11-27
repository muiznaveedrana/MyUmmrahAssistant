export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'premium';
  dailyCalls: number;
}