export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface CreateExpenseDTO {
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
  count: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'title';

export const STANDARD_CATEGORIES = [
  'All',
  'Infrastructure',
  'Meals & Catering',
  'Travel & Transit',
  'Software & SaaS',
  'Hardware & Equipment',
  'General & Misc'
];

export const ENTERPRISE_DEMO_TRANSACTIONS: CreateExpenseDTO[] = [
  { title: 'AWS Kubernetes EKS Cluster (us-east-1)', amount: 489.99, category: 'Infrastructure', date: new Date().toISOString().split('T')[0] },
  { title: 'Quarterly Engineering Dinner at Nobu NYC', amount: 840.50, category: 'Meals & Catering', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { title: 'Figma Enterprise Design Licensure (50 Seats)', amount: 350.00, category: 'Software & SaaS', date: new Date(Date.now() - 172800000).toISOString().split('T')[0] },
  { title: 'Apple MacBook Pro M3 Max (Dev Build)', amount: 3499.00, category: 'Hardware & Equipment', date: new Date(Date.now() - 259200000).toISOString().split('T')[0] },
  { title: 'Uber Black Transit to TechConf Vegas', amount: 84.20, category: 'Travel & Transit', date: new Date(Date.now() - 345600000).toISOString().split('T')[0] },
  { title: 'Datadog APM Production Telemetry Subscription', amount: 620.00, category: 'Infrastructure', date: new Date(Date.now() - 432000000).toISOString().split('T')[0] },
  { title: 'GitHub Enterprise Cloud CI/ID Pipeline Hours', amount: 410.00, category: 'Software & SaaS', date: new Date(Date.now() - 518400000).toISOString().split('T')[0] },
  { title: 'Ergobeast Standing Workstation & Aeron Chair', amount: 1195.00, category: 'Hardware & Equipment', date: new Date(Date.now() - 604800000).toISOString().split('T')[0] }
];
