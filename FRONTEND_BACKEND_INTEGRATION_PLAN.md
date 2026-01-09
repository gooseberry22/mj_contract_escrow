# Frontend-Backend Integration Plan

## Overview
This document outlines the plan to integrate the React frontend with the Django REST Framework backend, following the pattern established in `frontend_refernce`.

## Current State Analysis

### ✅ What's Already Set Up
- **Backend API**: Fully functional Django REST API with endpoints for:
  - Authentication (`/api/auth/`)
  - Contracts (`/api/contracts/`)
  - Payments (`/api/payments/`)
  - Milestones (`/api/milestones/`)
- **Infrastructure**: Docker Compose with Nginx reverse proxy configured
- **CORS**: Configured in Django settings
- **Frontend Config**: `env.ts` file exists with `getApiUrl()` function

### ❌ What's Missing
- No HTTP client (axios) installed
- No API service layer
- No state management (Redux/Context)
- No authentication token handling
- Components use mock data and `alert()` instead of API calls
- No error handling for API calls
- No loading states

## Integration Strategy

### Phase 1: Foundation Setup
**Goal**: Set up the core infrastructure for API communication

1. **Install Dependencies**
   - `axios` - HTTP client
   - `@reduxjs/toolkit` - State management
   - `react-redux` - React bindings for Redux
   - `redux-persist` - Persist auth state
   - `jwt-decode` - Decode JWT tokens (optional, for token inspection)

2. **Create API Constants File**
   - Location: `src/constants/api.ts`
   - Pattern: Similar to `frontend_refernce/src/constants/api.ts`
   - Include all backend endpoints:
     - Auth endpoints (signup, login, logout, token refresh, profile)
     - Contract endpoints
     - Payment endpoints
     - Milestone endpoints
   - Use `getApiUrl()` from `env.ts` for base URL

3. **Create API Utility**
   - Location: `src/utils/api.ts`
   - Create axios instance with:
     - Base timeout configuration
     - Request interceptor: Attach JWT token from Redux store
     - Response interceptor: Handle 401 errors, auto-refresh tokens
   - Export configured axios instance

4. **Set Up Redux Store**
   - Location: `src/store/store.ts`
   - Configure store with:
     - Redux Toolkit
     - Redux Persist (for auth tokens)
     - Middleware configuration
   - Inject store into API utility for interceptors

### Phase 2: State Management Slices
**Goal**: Create Redux slices for each domain

1. **User/Auth Slice** (`src/store/slices/userSlice.ts`)
   - State: `{ user, accessToken, refreshToken, isAuthenticated, loading, error }`
   - Actions:
     - `login` - Login with email/password
     - `signup` - Register new user
     - `logout` - Logout and clear tokens
     - `refreshToken` - Refresh access token
     - `fetchProfile` - Get user profile
     - `updateProfile` - Update user profile
     - `changePassword` - Change password

2. **Contracts Slice** (`src/store/slices/contractsSlice.ts`)
   - State: `{ contracts, currentContract, loading, error }`
   - Actions:
     - `fetchContracts` - List user's contracts
     - `fetchContract` - Get single contract
     - `createContract` - Create new contract
     - `updateContract` - Update contract
     - `uploadContractDocument` - Upload document

3. **Payments Slice** (`src/store/slices/paymentsSlice.ts`)
   - State: `{ payments, escrowAccounts, loading, error }`
   - Actions:
     - `fetchPayments` - List payments
     - `fetchPayment` - Get single payment
     - `createPayment` - Create payment
     - `updatePaymentStatus` - Update payment status
     - `fetchEscrowAccounts` - Get escrow accounts

4. **Milestones Slice** (`src/store/slices/milestonesSlice.ts`)
   - State: `{ milestones, currentMilestone, loading, error }`
   - Actions:
     - `fetchMilestones` - List milestones
     - `fetchMilestone` - Get single milestone
     - `createMilestone` - Create milestone
     - `updateMilestone` - Update milestone
     - `completeMilestone` - Mark milestone as complete
     - `uploadMilestoneDocument` - Upload document

### Phase 3: Component Integration
**Goal**: Replace mock data with real API calls

1. **Authentication Components**
   - `Login.tsx`: 
     - Use `login` action from userSlice
     - Handle loading/error states
     - Redirect on success
   - `CreateAccount.tsx`:
     - Use `signup` action
     - Handle form validation errors from API
     - Upload contract document if provided

2. **Dashboard Components**
   - `Dashboard.tsx`:
     - Fetch contracts, payments, milestones on mount
     - Display real data from Redux store
     - Handle loading states
   - `SurrogateDashboard.tsx`:
     - Submit reimbursement requests via API
     - Submit heartbeat confirmations via API
     - Fetch surrogate-specific data

3. **Feature Components**
   - `Payments.tsx`: Fetch and display payments
   - `Milestones.tsx`: Fetch and display milestones
   - `SurrogateLostWages.tsx`: Submit lost wages requests
   - `ContractParsing.tsx`: Upload and process contracts

### Phase 4: Authentication & Routing
**Goal**: Protect routes and handle authentication state

1. **Protected Route Wrapper**
   - Create `ProtectedRoute` component
   - Check `isAuthenticated` from Redux
   - Redirect to login if not authenticated
   - Persist auth state across page refreshes

2. **Update App.tsx**
   - Wrap protected routes with `ProtectedRoute`
   - Initialize auth state from persisted storage
   - Handle token refresh on app load

### Phase 5: Error Handling & UX
**Goal**: Improve user experience with proper error handling

1. **Error Handling**
   - Create error toast/notification system
   - Handle API errors gracefully
   - Display user-friendly error messages
   - Log errors for debugging

2. **Loading States**
   - Add loading indicators to all API calls
   - Disable buttons during submissions
   - Show skeleton loaders for data fetching

3. **Form Validation**
   - Integrate API validation errors with form fields
   - Show field-specific error messages
   - Handle network errors separately

## File Structure

```
frontend/src/
├── constants/
│   └── api.ts                    # API endpoint constants
├── store/
│   ├── store.ts                  # Redux store configuration
│   └── slices/
│       ├── userSlice.ts          # Auth/user state
│       ├── contractsSlice.ts      # Contracts state
│       ├── paymentsSlice.ts       # Payments state
│       └── milestonesSlice.ts     # Milestones state
├── utils/
│   └── api.ts                    # Axios instance with interceptors
├── components/
│   ├── Login.tsx                 # ✅ To integrate
│   ├── CreateAccount.tsx         # ✅ To integrate
│   ├── Dashboard.tsx             # ✅ To integrate
│   ├── Payments.tsx              # ✅ To integrate
│   ├── Milestones.tsx            # ✅ To integrate
│   ├── SurrogateDashboard.tsx    # ✅ To integrate
│   └── SurrogateLostWages.tsx    # ✅ To integrate
└── config/
    └── env.ts                    # ✅ Update to use VITE_API_URL
```

## API Endpoints Mapping

### Authentication (`/api/auth/`)
- `POST /api/auth/signup/` → SignUpView
- `POST /api/auth/token/` → CustomTokenObtainPairView
- `POST /api/auth/token/refresh/` → TokenRefreshView
- `POST /api/auth/logout/` → LogOutViewSet
- `GET /api/auth/profile/` → ProfileView
- `PUT /api/auth/profile/update/` → ProfileUpdateView
- `POST /api/auth/password/change/` → PasswordChangeView
- `GET /api/auth/users/` → UserListView

### Contracts (`/api/contracts/`)
- `GET /api/contracts/contracts/` → List contracts
- `POST /api/contracts/contracts/` → Create contract
- `GET /api/contracts/contracts/{id}/` → Get contract
- `PUT /api/contracts/contracts/{id}/` → Update contract
- `POST /api/contracts/contracts/{id}/upload_document/` → Upload document

### Payments (`/api/payments/`)
- `GET /api/payments/payments/` → List payments
- `POST /api/payments/payments/` → Create payment
- `GET /api/payments/payments/{id}/` → Get payment
- `PATCH /api/payments/payments/{id}/update_status/` → Update status
- `GET /api/payments/escrow/` → List escrow accounts

### Milestones (`/api/milestones/`)
- `GET /api/milestones/milestones/` → List milestones
- `POST /api/milestones/milestones/` → Create milestone
- `GET /api/milestones/milestones/{id}/` → Get milestone
- `PATCH /api/milestones/milestones/{id}/complete/` → Complete milestone
- `POST /api/milestones/milestones/{id}/upload_document/` → Upload document

## Environment Variables

Update `docker-compose.yml`:
```yaml
frontend:
  environment:
    - VITE_API_URL=http://localhost/api  # For dev (via nginx)
    # OR
    - VITE_API_URL=http://backend:8000/api  # Direct backend access
```

For production, set `VITE_API_URL` in build environment.

## Testing Strategy

1. **Manual Testing**
   - Test login/logout flow
   - Test signup with contract upload
   - Test data fetching on dashboard
   - Test form submissions
   - Test error scenarios (network errors, 401, 403, 500)

2. **Integration Testing**
   - Test token refresh flow
   - Test protected routes
   - Test API error handling
   - Test loading states

## Migration Notes

- **Gradual Migration**: Can integrate one component at a time
- **Backward Compatibility**: Keep mock data as fallback during development
- **Error Boundaries**: Add React error boundaries for API errors
- **TypeScript**: Add proper types for API responses

## Dependencies to Install

```bash
npm install axios @reduxjs/toolkit react-redux redux-persist
npm install --save-dev @types/jwt-decode  # If using jwt-decode
```

## Next Steps After Review

1. Review and approve this plan
2. Install dependencies
3. Create API constants file
4. Set up Redux store
5. Create slices one by one
6. Integrate components incrementally
7. Test each integration
8. Deploy and verify
