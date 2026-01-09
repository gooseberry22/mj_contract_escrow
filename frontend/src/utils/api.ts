/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { logout, refreshToken } from "../store/slices/userSlice";

const api = axios.create({
  timeout: 300000, // 5 minutes timeout for large file uploads
});

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

// Request Interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    if (store) {
      const state = store.getState();
      const token = state.user.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatically refresh access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && store) {
      originalRequest._retry = true;
      try {
        const { payload }: any = await store.dispatch(refreshToken());
        if (payload?.access) {
          originalRequest.headers.Authorization = `Bearer ${payload.access}`;
          return api(originalRequest);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
