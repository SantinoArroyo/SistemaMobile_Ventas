export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  cuil: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  customerCuil: string;
  items: SaleItem[];
  total: number;
  date: string;
  month: string; // formato: "YYYY-MM"
  year: number;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: string;
  createdAt: string;
}

export interface MonthlySales {
  month: string;
  totalSales: number;
  totalAmount: number;
  customerCount: number;
  sales: Sale[];
}

export interface AppState {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  stockMovements: StockMovement[];
  loading: boolean;
  error: string | null;
} 