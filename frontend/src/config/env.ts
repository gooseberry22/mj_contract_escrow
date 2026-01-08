/**
 * Environment Configuration
 * 
 * This file provides type-safe access to environment variables.
 * Only variables prefixed with VITE_ are available in the client-side code.
 */

interface Env {
  readonly VITE_API_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

/**
 * Get the API base URL
 * Falls back to a default if not set
 */
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};

/**
 * Check if we're in development mode
 */
export const isDev = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if we're in production mode
 */
export const isProd = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Get the current mode (development, production, etc.)
 */
export const getMode = (): string => {
  return import.meta.env.MODE;
};

/**
 * Environment configuration object
 * Use this for type-safe access to environment variables
 */
export const env: Env = {
  get VITE_API_URL() {
    return getApiUrl();
  },
  get MODE() {
    return import.meta.env.MODE;
  },
  get DEV() {
    return import.meta.env.DEV;
  },
  get PROD() {
    return import.meta.env.PROD;
  },
  get SSR() {
    return import.meta.env.SSR;
  },
} as Env;

// Export default for convenience
export default env;

