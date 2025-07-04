import { Product, Customer } from '../types';

export const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Laptop HP Pavilion',
    description: 'Laptop de 15 pulgadas con procesador Intel i5',
    price: 899.99,
    stock: 10,
    minStock: 3,
    category: 'Electrónicos',
  },
  {
    name: 'Mouse Inalámbrico',
    description: 'Mouse óptico inalámbrico con batería recargable',
    price: 25.50,
    stock: 50,
    minStock: 10,
    category: 'Accesorios',
  },
  {
    name: 'Teclado Mecánico',
    description: 'Teclado mecánico con switches Cherry MX Blue',
    price: 89.99,
    stock: 15,
    minStock: 5,
    category: 'Accesorios',
  },
  {
    name: 'Monitor 24"',
    description: 'Monitor LED de 24 pulgadas Full HD',
    price: 199.99,
    stock: 8,
    minStock: 2,
    category: 'Electrónicos',
  },
  {
    name: 'Cable HDMI',
    description: 'Cable HDMI de alta velocidad 2 metros',
    price: 12.99,
    stock: 100,
    minStock: 20,
    category: 'Cables',
  },
];

export const sampleCustomers: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Juan Pérez',
    cuil: '20-12345678-9',
    phone: '011-1234-5678',
    email: 'juan.perez@email.com',
    address: 'Av. Corrientes 1234, CABA',
  },
  {
    name: 'María González',
    cuil: '27-87654321-0',
    phone: '011-8765-4321',
    email: 'maria.gonzalez@email.com',
    address: 'Belgrano 567, CABA',
  },
  {
    name: 'Carlos Rodríguez',
    cuil: '30-11223344-5',
    phone: '011-1122-3344',
    email: 'carlos.rodriguez@email.com',
    address: 'Palermo 890, CABA',
  },
  {
    name: 'Ana López',
    cuil: '23-55667788-9',
    phone: '011-5566-7788',
    email: 'ana.lopez@email.com',
    address: 'Recoleta 234, CABA',
  },
  {
    name: 'Roberto Silva',
    cuil: '25-99887766-5',
    phone: '011-9988-7766',
    email: 'roberto.silva@email.com',
    address: 'San Telmo 456, CABA',
  },
]; 