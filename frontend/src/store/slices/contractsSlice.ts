import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CONTRACTS_URL,
  CONTRACT_URL,
  CONTRACT_UPLOAD_DOCUMENT_URL,
  CONTRACT_UPDATE_STATUS_URL,
  CONTRACT_DOCUMENTS_URL,
} from "../../constants/api";
import api from "../../utils/api";

interface ContractsState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contracts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentContract: any | null;
  loading: boolean;
  error: string | null;
}

interface CreateContractData {
  intended_parent: number;
  surrogate: number;
  title: string;
  description?: string;
  contract_amount: string | number;
  status?: string;
  start_date?: string;
  end_date?: string;
}

interface UpdateContractData {
  title?: string;
  description?: string;
  contract_amount?: string | number;
  status?: string;
  start_date?: string;
  end_date?: string;
}

interface UploadDocumentData {
  title: string;
  file: File;
}

// Fetch all contracts
export const fetchContracts = createAsyncThunk(
  "contracts/fetchContracts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(CONTRACTS_URL);
      return response.data; // DRF returns array directly for list view
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch contracts"
      );
    }
  }
);

// Fetch single contract
export const fetchContract = createAsyncThunk(
  "contracts/fetchContract",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(CONTRACT_URL(id));
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch contract"
      );
    }
  }
);

// Create contract
export const createContract = createAsyncThunk(
  "contracts/createContract",
  async (contractData: CreateContractData, { rejectWithValue }) => {
    try {
      const response = await api.post(CONTRACTS_URL, contractData);
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
      return rejectWithValue("Failed to create contract");
    }
  }
);

// Update contract
export const updateContract = createAsyncThunk(
  "contracts/updateContract",
  async (
    { id, data }: { id: number; data: UpdateContractData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(CONTRACT_URL(id), data);
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
      return rejectWithValue("Failed to update contract");
    }
  }
);

// Delete contract
export const deleteContract = createAsyncThunk(
  "contracts/deleteContract",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(CONTRACT_URL(id));
      return id;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to delete contract"
      );
    }
  }
);

// Upload contract document
export const uploadContractDocument = createAsyncThunk(
  "contracts/uploadDocument",
  async (
    { id, documentData }: { id: number; documentData: UploadDocumentData },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", documentData.title);
      formData.append("file", documentData.file);

      const response = await api.post(
        CONTRACT_UPLOAD_DOCUMENT_URL(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { contractId: id, document: response.data };
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { [key: string]: string[] | string } };
      };
      if (axiosError.response?.data) {
        const errorMessages = Object.entries(axiosError.response.data)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages[0] : messages;
            return `${field}: ${msg}`;
          })
          .join(", ");
        return rejectWithValue(errorMessages);
      }
      return rejectWithValue("Failed to upload document");
    }
  }
);

// Update contract status
export const updateContractStatus = createAsyncThunk(
  "contracts/updateStatus",
  async (
    { id, status }: { id: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(CONTRACT_UPDATE_STATUS_URL(id), {
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
          "Failed to update contract status"
      );
    }
  }
);

// Fetch contract documents (optional - can filter by contract)
export const fetchContractDocuments = createAsyncThunk(
  "contracts/fetchDocuments",
  async (contractId?: number, { rejectWithValue }) => {
    try {
      const params = contractId ? { contract: contractId } : {};
      const response = await api.get(CONTRACT_DOCUMENTS_URL, { params });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch documents"
      );
    }
  }
);

const initialState: ContractsState = {
  contracts: [],
  currentContract: null,
  loading: false,
  error: null,
};

const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentContract: (state, action: PayloadAction<any | null>) => {
      state.currentContract = action.payload;
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch contracts
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch contracts";
      })
      // Fetch single contract
      .addCase(fetchContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContract.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload;
        // Also update in contracts array if it exists
        const index = state.contracts.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      .addCase(fetchContract.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch contract";
      })
      // Create contract
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts.unshift(action.payload); // Add to beginning
        state.currentContract = action.payload;
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create contract";
      })
      // Update contract
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contracts.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        if (state.currentContract?.id === action.payload.id) {
          state.currentContract = action.payload;
        }
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update contract";
      })
      // Delete contract
      .addCase(deleteContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = state.contracts.filter((c) => c.id !== action.payload);
        if (state.currentContract?.id === action.payload) {
          state.currentContract = null;
        }
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete contract";
      })
      // Upload document
      .addCase(uploadContractDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadContractDocument.fulfilled, (state, action) => {
        state.loading = false;
        // Update current contract if it matches
        if (
          state.currentContract?.id === action.payload.contractId &&
          state.currentContract.documents
        ) {
          state.currentContract.documents.push(action.payload.document);
        }
        // Update in contracts array
        const contract = state.contracts.find(
          (c) => c.id === action.payload.contractId
        );
        if (contract && contract.documents) {
          contract.documents.push(action.payload.document);
        }
      })
      .addCase(uploadContractDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to upload document";
      })
      // Update status
      .addCase(updateContractStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contracts.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        if (state.currentContract?.id === action.payload.id) {
          state.currentContract = action.payload;
        }
      })
      .addCase(updateContractStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update contract status";
      });
  },
});

export const { clearError, setCurrentContract, clearCurrentContract } =
  contractsSlice.actions;
export default contractsSlice.reducer;
