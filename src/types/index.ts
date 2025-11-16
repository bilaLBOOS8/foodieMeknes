export interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  ingredients: string[];
  options: ProductOption[];
  is_available: boolean;
  preparation_time: number;
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  name: string;
  type: 'meat' | 'sauce' | 'side' | 'other';
  choices: string[];
  required: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations: Record<string, string>;
  unit_price: number;
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  delivery_method: 'delivery' | 'pickup';
  notes?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_info: CustomerInfo;
  items: CartItem[];
  total_price: number;
  status: OrderStatus;
  payment_method: 'cash';
  payment_details: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface AdminUser {
  id: number;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  last_login: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface MenuState {
  categories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}