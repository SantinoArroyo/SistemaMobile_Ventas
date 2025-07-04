import * as SQLite from 'expo-sqlite';
import { Product, Customer, Sale, SaleItem, StockMovement } from '../types';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('deposito.db');
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // Tabla de productos
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        minStock INTEGER NOT NULL DEFAULT 0,
        category TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Tabla de clientes
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cuil TEXT NOT NULL UNIQUE,
        phone TEXT,
        email TEXT,
        address TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Tabla de ventas
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        customerId TEXT NOT NULL,
        customerName TEXT NOT NULL,
        customerCuil TEXT NOT NULL,
        total REAL NOT NULL,
        date TEXT NOT NULL,
        month TEXT NOT NULL,
        year INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (customerId) REFERENCES customers (id)
      );
    `);

    // Tabla de items de venta
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id TEXT PRIMARY KEY,
        saleId TEXT NOT NULL,
        productId TEXT NOT NULL,
        productName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitPrice REAL NOT NULL,
        total REAL NOT NULL,
        FOREIGN KEY (saleId) REFERENCES sales (id),
        FOREIGN KEY (productId) REFERENCES products (id)
      );
    `);

    // Tabla de movimientos de stock
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS stock_movements (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        productName TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (productId) REFERENCES products (id)
      );
    `);
  }

  // Métodos para productos
  async getProducts(): Promise<Product[]> {
    if (!this.db) return [];
    const result = await this.db.getAllAsync('SELECT * FROM products ORDER BY name');
    return result as Product[];
  }

  async addProduct(product: Product): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'INSERT INTO products (id, name, description, price, stock, minStock, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [product.id, product.name, product.description || null, product.price, product.stock, product.minStock, product.category, product.createdAt, product.updatedAt]
    );
  }

  async updateProduct(product: Product): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, minStock = ?, category = ?, updatedAt = ? WHERE id = ?',
      [product.name, product.description || null, product.price, product.stock, product.minStock, product.category, product.updatedAt, product.id]
    );
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM products WHERE id = ?', [id]);
  }

  // Métodos para clientes
  async getCustomers(): Promise<Customer[]> {
    if (!this.db) return [];
    const result = await this.db.getAllAsync('SELECT * FROM customers ORDER BY name');
    return result as Customer[];
  }

  async addCustomer(customer: Customer): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'INSERT INTO customers (id, name, cuil, phone, email, address, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customer.id, customer.name, customer.cuil, customer.phone || null, customer.email || null, customer.address || null, customer.createdAt, customer.updatedAt]
    );
  }

  async updateCustomer(customer: Customer): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'UPDATE customers SET name = ?, cuil = ?, phone = ?, email = ?, address = ?, updatedAt = ? WHERE id = ?',
      [customer.name, customer.cuil, customer.phone || null, customer.email || null, customer.address || null, customer.updatedAt, customer.id]
    );
  }

  async deleteCustomer(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM customers WHERE id = ?', [id]);
  }

  // Métodos para ventas
  async getSales(): Promise<Sale[]> {
    if (!this.db) return [];
    const sales = await this.db.getAllAsync('SELECT * FROM sales ORDER BY date DESC') as Sale[];
    
    // Obtener items para cada venta
    for (const sale of sales) {
      const items = await this.db.getAllAsync('SELECT * FROM sale_items WHERE saleId = ?', [sale.id]) as SaleItem[];
      sale.items = items;
    }
    
    return sales;
  }

  async getSalesByMonth(month: string): Promise<Sale[]> {
    if (!this.db) return [];
    const sales = await this.db.getAllAsync('SELECT * FROM sales WHERE month = ? ORDER BY date DESC', [month]) as Sale[];
    
    for (const sale of sales) {
      const items = await this.db.getAllAsync('SELECT * FROM sale_items WHERE saleId = ?', [sale.id]) as SaleItem[];
      sale.items = items;
    }
    
    return sales;
  }

  async addSale(sale: Sale): Promise<void> {
    if (!this.db) return;
    
    await this.db.runAsync(
      'INSERT INTO sales (id, customerId, customerName, customerCuil, total, date, month, year, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sale.id, sale.customerId, sale.customerName, sale.customerCuil, sale.total, sale.date, sale.month, sale.year, sale.createdAt]
    );

    // Insertar items de la venta
    for (const item of sale.items) {
      await this.db.runAsync(
        'INSERT INTO sale_items (id, saleId, productId, productName, quantity, unitPrice, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.id, sale.id, item.productId, item.productName, item.quantity, item.unitPrice, item.total]
      );
    }
  }

  // Métodos para movimientos de stock
  async getStockMovements(): Promise<StockMovement[]> {
    if (!this.db) return [];
    const result = await this.db.getAllAsync('SELECT * FROM stock_movements ORDER BY date DESC');
    return result as StockMovement[];
  }

  async addStockMovement(movement: StockMovement): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'INSERT INTO stock_movements (id, productId, productName, type, quantity, reason, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [movement.id, movement.productId, movement.productName, movement.type, movement.quantity, movement.reason, movement.date, movement.createdAt]
    );
  }

  // Métodos de utilidad
  async getProductById(id: string): Promise<Product | null> {
    if (!this.db) return null;
    const result = await this.db.getFirstAsync('SELECT * FROM products WHERE id = ?', [id]);
    return result as Product | null;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    if (!this.db) return null;
    const result = await this.db.getFirstAsync('SELECT * FROM customers WHERE id = ?', [id]);
    return result as Customer | null;
  }

  async getCustomerByCuil(cuil: string): Promise<Customer | null> {
    if (!this.db) return null;
    const result = await this.db.getFirstAsync('SELECT * FROM customers WHERE cuil = ?', [cuil]);
    return result as Customer | null;
  }

  async updateProductStock(productId: string, newStock: number): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'UPDATE products SET stock = ?, updatedAt = ? WHERE id = ?',
      [newStock, new Date().toISOString(), productId]
    );
  }
}

export const database = new Database(); 