import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MILESTONES_URL,
  MILESTONE_URL,
  MILESTONE_COMPLETE_URL,
  MILESTONE_UPDATE_STATUS_URL,
  MILESTONE_UPLOAD_DOCUMENT_URL,
  MILESTONE_DOCUMENTS_URL,
} from "../../constants/api";
import api from "../../utils/api";

interface MilestonesState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  milestones: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentMilestone: any | null;
  loading: boolean;
  error: string | null;
}

interface CreateMilestoneData {
  contract: number;
  title: string;
  description?: string;
  amount: string | number;
  status?: string;
  due_date?: string;
  order?: number;
}

interface UpdateMilestoneData {
  title?: string;
  description?: string;
  amount?: string | number;
  status?: string;
  due_date?: string;
  order?: number;
}

interface CompleteMilestoneData {
  completion_notes?: string;
}

interface UploadDocumentData {
  title: string;
  file: File;
}

// Fetch all milestones (optionally filtered by contract)
export const fetchMilestones = createAsyncThunk(
  "milestones/fetchMilestones",
  async ({ contractId }: { contractId: number }, { rejectWithValue }) => {
    try {
      const params = contractId ? { contract: contractId } : {};
      const response = await api.get(MILESTONES_URL, { params });
      return response.data; // DRF returns array directly for list view
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch milestones"
      );
    }
  }
);

// Fetch single milestone
export const fetchMilestone = createAsyncThunk(
  "milestones/fetchMilestone",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(MILESTONE_URL(id));
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to fetch milestone"
      );
    }
  }
);

// Create milestone
export const createMilestone = createAsyncThunk(
  "milestones/createMilestone",
  async (milestoneData: CreateMilestoneData, { rejectWithValue }) => {
    try {
      const response = await api.post(MILESTONES_URL, milestoneData);
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
      return rejectWithValue("Failed to create milestone");
    }
  }
);

// Update milestone
export const updateMilestone = createAsyncThunk(
  "milestones/updateMilestone",
  async (
    { id, data }: { id: number; data: UpdateMilestoneData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(MILESTONE_URL(id), data);
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
      return rejectWithValue("Failed to update milestone");
    }
  }
);

// Delete milestone
export const deleteMilestone = createAsyncThunk(
  "milestones/deleteMilestone",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(MILESTONE_URL(id));
      return id;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string; message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Failed to delete milestone"
      );
    }
  }
);

// Complete milestone
export const completeMilestone = createAsyncThunk(
  "milestones/completeMilestone",
  async (
    { id, data }: { id: number; data?: CompleteMilestoneData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(MILESTONE_COMPLETE_URL(id), data || {});
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; detail?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          "Failed to complete milestone"
      );
    }
  }
);

// Update milestone status
export const updateMilestoneStatus = createAsyncThunk(
  "milestones/updateStatus",
  async (
    { id, status }: { id: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(MILESTONE_UPDATE_STATUS_URL(id), {
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
          "Failed to update milestone status"
      );
    }
  }
);

// Upload milestone document
export const uploadMilestoneDocument = createAsyncThunk(
  "milestones/uploadDocument",
  async (
    { id, documentData }: { id: number; documentData: UploadDocumentData },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", documentData.title);
      formData.append("file", documentData.file);

      const response = await api.post(
        MILESTONE_UPLOAD_DOCUMENT_URL(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { milestoneId: id, document: response.data };
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

// Fetch milestone documents (optional - can filter by milestone)
export const fetchMilestoneDocuments = createAsyncThunk(
  "milestones/fetchDocuments",
  async ({ milestoneId }: { milestoneId: number }, { rejectWithValue }) => {
    try {
      const params = milestoneId ? { milestone: milestoneId } : {};
      const response = await api.get(MILESTONE_DOCUMENTS_URL, { params });
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

const initialState: MilestonesState = {
  milestones: [],
  currentMilestone: null,
  loading: false,
  error: null,
};

const milestonesSlice = createSlice({
  name: "milestones",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMilestone: (state, action: PayloadAction<any | null>) => {
      state.currentMilestone = action.payload;
    },
    clearCurrentMilestone: (state) => {
      state.currentMilestone = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch milestones
      .addCase(fetchMilestones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestones.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = action.payload;
      })
      .addCase(fetchMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch milestones";
      })
      // Fetch single milestone
      .addCase(fetchMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMilestone = action.payload;
        // Also update in milestones array if it exists
        const index = state.milestones.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      .addCase(fetchMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch milestone";
      })
      // Create milestone
      .addCase(createMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones.push(action.payload); // Add to end (ordered by order field)
        state.currentMilestone = action.payload;
      })
      .addCase(createMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create milestone";
      })
      // Update milestone
      .addCase(updateMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.milestones.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
        if (state.currentMilestone?.id === action.payload.id) {
          state.currentMilestone = action.payload;
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update milestone";
      })
      // Delete milestone
      .addCase(deleteMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = state.milestones.filter((m) => m.id !== action.payload);
        if (state.currentMilestone?.id === action.payload) {
          state.currentMilestone = null;
        }
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete milestone";
      })
      // Complete milestone
      .addCase(completeMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.milestones.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
        if (state.currentMilestone?.id === action.payload.id) {
          state.currentMilestone = action.payload;
        }
      })
      .addCase(completeMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to complete milestone";
      })
      // Update status
      .addCase(updateMilestoneStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMilestoneStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.milestones.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
        if (state.currentMilestone?.id === action.payload.id) {
          state.currentMilestone = action.payload;
        }
      })
      .addCase(updateMilestoneStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update milestone status";
      })
      // Upload document
      .addCase(uploadMilestoneDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMilestoneDocument.fulfilled, (state, action) => {
        state.loading = false;
        // Update current milestone if it matches
        if (
          state.currentMilestone?.id === action.payload.milestoneId &&
          state.currentMilestone.documents
        ) {
          state.currentMilestone.documents.push(action.payload.document);
        }
        // Update in milestones array
        const milestone = state.milestones.find(
          (m) => m.id === action.payload.milestoneId
        );
        if (milestone && milestone.documents) {
          milestone.documents.push(action.payload.document);
        }
      })
      .addCase(uploadMilestoneDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to upload document";
      });
  },
});

export const { clearError, setCurrentMilestone, clearCurrentMilestone } =
  milestonesSlice.actions;
export default milestonesSlice.reducer;
