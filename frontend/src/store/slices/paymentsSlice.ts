import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PAYMENTS_URL,
  PAYMENT_URL,
  PAYMENT_UPDATE_STATUS_URL,
  ESCROW_ACCOUNTS_URL,
  ESCROW_DEPOSIT_URL,
  ESCROW_RELEASE_URL,
} from "../../constants/api";
import api from "../../utils/api";

interface PaymentsState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payments: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  escrowAccounts: any[];
  loading: boolean;
  error: string | null;
}

interface CreatePaymentData {
  contract: number;
  payer: number;
  payee: number;
  amount: string | number;
  payment_type: string;
  description?: string;
  notes?: string;
}

// Fetch payments (optionally filtered by contract)
export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (contractId?: number, { rejectWithValue }) => {
    try {
      const params = contractId ? { contract: contractId } : {};
      const response = await api.get(PAYMENTS_URL, { params });
      return response.data; // DRF returns array directly for list view
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch payments"
      );
    }
  }
);

// Fetch single payment
export const fetchPayment = createAsyncThunk(
  "payments/fetchPayment",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(PAYMENT_URL(id));
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch payment"
      );
    }
  }
);

// Create payment
export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (paymentData: CreatePaymentData, { rejectWithValue }) => {
    try {
      const response = await api.post(PAYMENTS_URL, paymentData);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { [key: string]: string[] | string } };
      };
      if (axiosError.response?.data) {
        // Handle validation errors
        const errorMessages = Object.entries(axiosError.response.data)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages[0] : messages;
            return `${field}: ${msg}`;
          })
          .join(", ");
        return rejectWithValue(errorMessages);
      }
      return rejectWithValue("Failed to create payment");
    }
  }
);

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
  "payments/updateStatus",
  async (
    { id, status }: { id: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(PAYMENT_UPDATE_STATUS_URL(id), {
        status,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; detail?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          "Failed to update payment status"
      );
    }
  }
);

// Fetch escrow accounts (optionally filtered by contract)
export const fetchEscrowAccounts = createAsyncThunk(
  "payments/fetchEscrowAccounts",
  async (contractId?: number, { rejectWithValue }) => {
    try {
      const params = contractId ? { contract: contractId } : {};
      const response = await api.get(ESCROW_ACCOUNTS_URL, { params });
      return response.data; // DRF returns array directly for list view
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch escrow accounts"
      );
    }
  }
);

// Deposit funds into escrow account
export const depositEscrow = createAsyncThunk(
  "payments/depositEscrow",
  async (
    { id, amount }: { id: number; amount: string | number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(ESCROW_DEPOSIT_URL(id), { amount });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; detail?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          "Failed to deposit funds"
      );
    }
  }
);

// Release funds from escrow account
export const releaseEscrow = createAsyncThunk(
  "payments/releaseEscrow",
  async (
    { id, amount }: { id: number; amount: string | number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(ESCROW_RELEASE_URL(id), { amount });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; detail?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          "Failed to release funds"
      );
    }
  }
);

const initialState: PaymentsState = {
  payments: [],
  escrowAccounts: [],
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch payments";
      })
      // Fetch single payment
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Update in payments array if it exists
        const index = state.payments.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.payments[index] = action.payload;
        } else {
          state.payments.push(action.payload);
        }
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch payment";
      })
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.unshift(action.payload); // Add to beginning
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create payment";
      })
      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update payment status";
      })
      // Fetch escrow accounts
      .addCase(fetchEscrowAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEscrowAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.escrowAccounts = action.payload;
      })
      .addCase(fetchEscrowAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch escrow accounts";
      })
      // Deposit escrow
      .addCase(depositEscrow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(depositEscrow.fulfilled, (state, action) => {
        state.loading = false;
        // Update escrow account in array
        const index = state.escrowAccounts.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.escrowAccounts[index] = action.payload;
        }
      })
      .addCase(depositEscrow.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to deposit funds";
      })
      // Release escrow
      .addCase(releaseEscrow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(releaseEscrow.fulfilled, (state, action) => {
        state.loading = false;
        // Update escrow account in array
        const index = state.escrowAccounts.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.escrowAccounts[index] = action.payload;
        }
      })
      .addCase(releaseEscrow.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to release funds";
      });
  },
});

export const { clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
