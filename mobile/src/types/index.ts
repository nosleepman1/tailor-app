// TailleurPro Mobile — TypeScript Domain Definitions

export type UserRole = 'admin' | 'tailor';

export interface User {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  city?: string | null;
  role: UserRole;
  active: boolean;
  is_subscribed: boolean;
  expo_push_token?: string | null;
  theme?: 'light' | 'dark' | 'system';
  created_at: string;
}

export interface Measurement {
  id?: number;
  client_id?: number;
  neck?: number | null;
  chest?: number | null;
  shoulder?: number | null;
  arm_length?: number | null;
  belly?: number | null;
  boubou_length?: number | null;
  pant_length?: number | null;
  hips?: number | null;
  thigh?: number | null;
  biceps?: number | null;
  wrist?: number | null;
  ankle?: number | null;
  notes?: string | null;
  updated_at?: string;
}

export interface Client {
  id: number;
  tailor_id: number;
  full_name: string;
  firstname?: string | null;
  lastname?: string | null;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  measurement?: Measurement | null;
  active_commandes_count?: number;
  commandes_count?: number;
  created_at: string;
  updated_at: string;
}

export type CommandeStatus = 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';

export interface EventItem {
  id: number;
  name: string;
  type: string;
  date?: string | null;
  is_recurring: boolean;
}

export interface Revenue {
  id: number;
  amount: number;
  type: 'advance' | 'balance' | 'other';
  payment_date: string;
  status: string;
}

export interface Commande {
  id: number;
  tailor_id: number;
  client_id: number;
  event_id?: number | null;
  fabric_description: string;
  images?: string[] | null;
  price: number;
  deposit_paid: number;
  remaining_balance?: number;
  status: CommandeStatus;
  due_date?: string | null;
  due_date_remaining?: string | null;
  notes?: string | null;
  client?: Client;
  event?: EventItem | null;
  revenues?: Revenue[];
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan: 'basic' | 'premium';
  amount: number;
  status: 'active' | 'pending' | 'expired';
  dexpay_reference?: string;
  starts_at?: string;
  expires_at?: string;
}

export interface SubscriptionPlan {
  id: 'basic' | 'premium';
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
}

export interface DashboardStats {
  orders_in_progress: number;
  orders_ready: number;
  deliveries_this_week: number;
  total_revenue_month: number;
  total_debtors_amount: number;
  clients_count: number;
  recent_commandes?: Commande[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  errors?: Record<string, string[]>;
}

// Navigation Parameters
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ClientDetail: { clientId: number };
  AddClient: { client?: Client };
  CommandeDetail: { commandeId: number };
  AddCommande: { clientId?: number };
  PaymentCheckout: { checkoutUrl: string; token: string };
  CameraModal: { onPhotoCaptured: (uri: string) => void };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Commandes: undefined;
  Clients: undefined;
  Subscription: undefined;
  Settings: undefined;
};
