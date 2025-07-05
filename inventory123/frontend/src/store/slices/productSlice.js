import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI, apiUtils } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productsAPI.create(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, ...productData }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.update(id, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  'products/uploadImage',
  async ({ id, imageFile }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.uploadImage(id, imageFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      // Upload image
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer; 