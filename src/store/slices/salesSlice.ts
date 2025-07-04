import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Sale, SaleItem } from '../../types';
import { database } from '../../database/database';

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async () => {
    return await database.getSales();
  }
);

export const fetchSalesByMonth = createAsyncThunk(
  'sales/fetchSalesByMonth',
  async (month: string) => {
    return await database.getSalesByMonth(month);
  }
);

export const addSale = createAsyncThunk(
  'sales/addSale',
  async (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    // Agregar la venta a la base de datos
    await database.addSale(newSale);
    
    // Actualizar el stock de cada producto vendido
    for (const item of sale.items) {
      const product = await database.getProductById(item.productId);
      if (product) {
        const newStock = product.stock - item.quantity;
        const updatedProduct = {
          ...product,
          stock: Math.max(0, newStock), // No permitir stock negativo
          updatedAt: new Date().toISOString(),
        };
        
        // Actualizar en la base de datos
        await database.updateProduct(updatedProduct);
      }
    }
    
    return newSale;
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar ventas';
      })
      // fetchSalesByMonth
      .addCase(fetchSalesByMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSalesByMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar ventas del mes';
      })
      // addSale
      .addCase(addSale.fulfilled, (state, action) => {
        state.sales.unshift(action.payload);
      })
      .addCase(addSale.rejected, (state, action) => {
        state.error = action.error.message || 'Error al agregar venta';
      });
  },
});

export const { clearError } = salesSlice.actions;
export default salesSlice.reducer; 