import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Customer } from '../../types';
import { database } from '../../database/database';

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    return await database.getCustomers();
  }
);

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await database.addCustomer(newCustomer);
    return newCustomer;
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async (customer: Customer) => {
    const updatedCustomer = {
      ...customer,
      updatedAt: new Date().toISOString(),
    };
    await database.updateCustomer(updatedCustomer);
    return updatedCustomer;
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string) => {
    await database.deleteCustomer(id);
    return id;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCustomers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar clientes';
      })
      // addCustomer
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.error = action.error.message || 'Error al agregar cliente';
      })
      // updateCustomer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.error.message || 'Error al actualizar cliente';
      })
      // deleteCustomer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.error.message || 'Error al eliminar cliente';
      });
  },
});

export const { clearError } = customersSlice.actions;
export default customersSlice.reducer; 