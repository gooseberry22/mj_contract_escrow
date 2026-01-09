/**
 * API Endpoint Constants
 * 
 * This file contains all API endpoint URLs for the application.
 * Uses getApiUrl() from config/env.ts to get the base API URL.
 */

import { getApiUrl } from '../config/env';

const API_URL = getApiUrl();

// ============================================================================
// Authentication Endpoints
// ============================================================================

export const SIGNUP_URL = `${API_URL}/auth/signup/`;
export const LOGIN_URL = `${API_URL}/auth/token/`;
export const LOGOUT_URL = `${API_URL}/auth/logout/`;
export const REFRESH_TOKEN_URL = `${API_URL}/auth/token/refresh/`;
export const PROFILE_URL = `${API_URL}/auth/profile/`;
export const PROFILE_UPDATE_URL = `${API_URL}/auth/profile/update/`;
export const PASSWORD_CHANGE_URL = `${API_URL}/auth/password/change/`;
export const USERS_LIST_URL = `${API_URL}/auth/users/`;
export const USER_DETAIL_URL = (id: number) => `${API_URL}/auth/users/${id}/`;

// ============================================================================
// Contract Endpoints
// ============================================================================

// Contract CRUD operations
export const CONTRACTS_URL = `${API_URL}/contracts/contracts/`;
export const CONTRACT_URL = (id: number) => `${API_URL}/contracts/contracts/${id}/`;

// Contract custom actions
export const CONTRACT_UPLOAD_DOCUMENT_URL = (id: number) => 
  `${API_URL}/contracts/contracts/${id}/upload_document/`;
export const CONTRACT_UPDATE_STATUS_URL = (id: number) => 
  `${API_URL}/contracts/contracts/${id}/update_status/`;

// Contract documents
export const CONTRACT_DOCUMENTS_URL = `${API_URL}/contracts/documents/`;
export const CONTRACT_DOCUMENT_URL = (id: number) => 
  `${API_URL}/contracts/documents/${id}/`;

// ============================================================================
// Payment Endpoints
// ============================================================================

// Payment CRUD operations
export const PAYMENTS_URL = `${API_URL}/payments/payments/`;
export const PAYMENT_URL = (id: number) => `${API_URL}/payments/payments/${id}/`;

// Payment custom actions
export const PAYMENT_UPDATE_STATUS_URL = (id: number) => 
  `${API_URL}/payments/payments/${id}/update_status/`;

// Escrow account operations
export const ESCROW_ACCOUNTS_URL = `${API_URL}/payments/escrow/`;
export const ESCROW_ACCOUNT_URL = (id: number) => 
  `${API_URL}/payments/escrow/${id}/`;
export const ESCROW_DEPOSIT_URL = (id: number) => 
  `${API_URL}/payments/escrow/${id}/deposit/`;
export const ESCROW_RELEASE_URL = (id: number) => 
  `${API_URL}/payments/escrow/${id}/release/`;

// ============================================================================
// Milestone Endpoints
// ============================================================================

// Milestone CRUD operations
export const MILESTONES_URL = `${API_URL}/milestones/milestones/`;
export const MILESTONE_URL = (id: number) => 
  `${API_URL}/milestones/milestones/${id}/`;

// Milestone custom actions
export const MILESTONE_COMPLETE_URL = (id: number) => 
  `${API_URL}/milestones/milestones/${id}/complete/`;
export const MILESTONE_UPDATE_STATUS_URL = (id: number) => 
  `${API_URL}/milestones/milestones/${id}/update_status/`;
export const MILESTONE_UPLOAD_DOCUMENT_URL = (id: number) => 
  `${API_URL}/milestones/milestones/${id}/upload_document/`;

// Milestone documents
export const MILESTONE_DOCUMENTS_URL = `${API_URL}/milestones/documents/`;
export const MILESTONE_DOCUMENT_URL = (id: number) => 
  `${API_URL}/milestones/documents/${id}/`;
