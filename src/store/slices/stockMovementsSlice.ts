import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StockMovement } from '../../types';
import { database } from '../../database/database';

interface StockMovementsState {
  stockMovements: StockMovement[];
  loading: boolean;
  error: string | null;
}

const initialState: StockMovementsState = {
  stockMovements: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchStockMovements = createAsyncThunk(
  'stockMovements/fetchStockMovements',
  async () => {
    return await database.getStockMovements();
  }
);

export const addStockMovement = createAsyncThunk(
  'stockMovements/addStockMovement',
  async (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    await database.addStockMovement(newMovement);
    return newMovement;
  }
);

const stockMovementsSlice = createSlice({
  name: 'stockMovements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStockMovements
      .addCase(fetchStockMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.stockMovements = action.payload;
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar movimientos de stock';
      })
      // addStockMovement
      .addCase(addStockMovement.fulfilled, (state, action) => {
        state.stockMovements.unshift(action.payload);
      })
      .addCase(addStockMovement.rejected, (state, action) => {
        state.error = action.error.message || 'Error al agregar movimiento de stock';
      });
  },
});

export const { clearError } = stockMovementsSlice.actions;
export default stockMovementsSlice.reducer; 