import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import customersReducer from './slices/customersSlice';
import salesReducer from './slices/salesSlice';
import stockMovementsReducer from './slices/stockMovementsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    sales: salesReducer,
    stockMovements: stockMovementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 