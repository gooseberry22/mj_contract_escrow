import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  SIGNUP_URL,
  LOGIN_URL,
  LOGOUT_URL,
  REFRESH_TOKEN_URL,
  PROFILE_URL,
  PROFILE_UPDATE_URL,
  PASSWORD_CHANGE_URL,
} from "../../constants/api";
import api from "../../utils/api";

interface UserState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_superuser: boolean;
  };
}

interface SignUpData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface SignUpResponse {
  status: string;
  message: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

// Login action
export const login = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(LOGIN_URL, credentials);
      const { access, refresh, user } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      return { access, refresh, user };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        axiosError.response?.data?.detail || "Login failed"
      );
    }
  }
);

// Signup action
export const signup = createAsyncThunk(
  "user/signup",
  async (userData: SignUpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(SIGNUP_URL, userData);
      const data: SignUpResponse = response.data;

      // Signup doesn't return tokens - user needs to login after signup
      return data.user;
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
      return rejectWithValue("Signup failed");
    }
  }
);

// Logout action
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const { refreshToken, accessToken } = state.user;

      if (refreshToken && accessToken) {
        await api.post(LOGOUT_URL, { refresh_token: refreshToken });
      }

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return true;
    } catch {
      // Even if logout fails, clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue("Logout failed");
    }
  }
);

// Refresh token action
export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const { refreshToken } = state.user;

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(REFRESH_TOKEN_URL, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem("accessToken", access);

      return { access };
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue("Token refresh failed");
    }
  }
);

// Fetch profile action
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const { accessToken } = state.user;

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await api.get(PROFILE_URL);
      // Backend returns { status: "success", user: {...} }
      return response.data.user;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string; detail?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.detail ||
          "Failed to fetch profile"
      );
    }
  }
);

// Update profile action
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData: ProfileUpdateData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const { accessToken } = state.user;

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await api.put(PROFILE_UPDATE_URL, profileData);
      // Backend returns { status: "success", message: "...", user: {...} }
      return response.data.user;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string; [key: string]: any } };
      };
      if (axiosError.response?.data) {
        // Handle validation errors
        const errorMessages = Object.entries(axiosError.response.data)
          .filter(([key]) => key !== "message")
          .map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages[0] : messages;
            return `${field}: ${msg}`;
          });
        if (errorMessages.length > 0) {
          return rejectWithValue(errorMessages.join(", "));
        }
        return rejectWithValue(
          axiosError.response.data.message || "Failed to update profile"
        );
      }
      return rejectWithValue("Failed to update profile");
    }
  }
);

// Change password action
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData: PasswordChangeData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const { accessToken } = state.user;

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await api.post(PASSWORD_CHANGE_URL, passwordData);
      // Backend returns { status: "success", message: "..." }
      return response.data.message;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { [key: string]: string[] | string } };
      };
      if (axiosError.response?.data) {
        // Return the first error message from the response
        const firstError = Object.values(axiosError.response.data)[0];
        return rejectWithValue(
          Array.isArray(firstError) ? firstError[0] : firstError
        );
      }
      return rejectWithValue("Failed to change password");
    }
  }
);

const initialState: UserState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.access;
          state.refreshToken = action.payload.refresh;
          state.isAuthenticated = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // Note: Signup doesn't set tokens - user needs to login after signup
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Signup failed";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Refresh token
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<{ access: string }>) => {
          state.accessToken = action.payload.access;
          // Also update localStorage with the new access token
          localStorage.setItem("accessToken", action.payload.access);
        }
      )
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = (action.payload as string) || "Token refresh failed";
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
      })
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch profile";
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update profile";
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to change password";
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
