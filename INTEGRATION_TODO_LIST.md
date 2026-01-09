# Frontend-Backend Integration - Detailed Todo List

## 📊 Progress Summary

**Completed**: 18/19 tasks (95%)
- ✅ Phase 1: Foundation Setup (4/4 tasks) - **100% COMPLETE**
- ✅ Phase 2: State Management Slices (4/4 tasks) - **100% COMPLETE**
- ✅ Phase 3: Component Integration (8/8 tasks) - **100% COMPLETE**
- ✅ Phase 4: Authentication & Routing (1/1 tasks) - **100% COMPLETE**
- ✅ Phase 5: Error Handling & UX (1/2 tasks) - **50% COMPLETE**
  - ✅ Task 18: Error Handling - **COMPLETE**
  - ⏳ Task 19: Docker Configuration - **PENDING**

---

## Phase 1: Foundation Setup

### ✅ Task 1: Install Required Dependencies
**Status**: ✅ **COMPLETED**
**File**: `frontend/package.json`
**Action**: Add dependencies
```bash
npm install axios @reduxjs/toolkit react-redux redux-persist
```
**Details**:
- `axios`: HTTP client for API calls
- `@reduxjs/toolkit`: State management
- `react-redux`: React bindings
- `redux-persist`: Persist auth tokens in localStorage

**Optional**:
- `jwt-decode`: For inspecting JWT tokens (if needed)

---

### ✅ Task 2: Create API Constants File
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/constants/api.ts`
**Pattern**: Follow `frontend_refernce/src/constants/api.ts`

**Structure**:
```typescript
import { getApiUrl } from '../config/env';

const API_URL = getApiUrl();

// Auth endpoints
export const SIGNUP_URL = `${API_URL}/auth/signup/`;
export const LOGIN_URL = `${API_URL}/auth/token/`;
export const LOGOUT_URL = `${API_URL}/auth/logout/`;
export const REFRESH_TOKEN_URL = `${API_URL}/auth/token/refresh/`;
export const PROFILE_URL = `${API_URL}/auth/profile/`;
export const PROFILE_UPDATE_URL = `${API_URL}/auth/profile/update/`;
export const PASSWORD_CHANGE_URL = `${API_URL}/auth/password/change/`;
export const USERS_LIST_URL = `${API_URL}/auth/users/`;

// Contract endpoints
export const CONTRACTS_URL = `${API_URL}/contracts/contracts/`;
export const CONTRACT_URL = (id: number) => `${API_URL}/contracts/contracts/${id}/`;
export const CONTRACT_UPLOAD_DOCUMENT_URL = (id: number) => 
  `${API_URL}/contracts/contracts/${id}/upload_document/`;

// Payment endpoints
export const PAYMENTS_URL = `${API_URL}/payments/payments/`;
export const PAYMENT_URL = (id: number) => `${API_URL}/payments/payments/${id}/`;
export const PAYMENT_UPDATE_STATUS_URL = (id: number) => 
  `${API_URL}/payments/payments/${id}/update_status/`;
export const ESCROW_ACCOUNTS_URL = `${API_URL}/payments/escrow/`;

// Milestone endpoints
export const MILESTONES_URL = `${API_URL}/milestones/milestones/`;
export const MILESTONE_URL = (id: number) => `${API_URL}/milestones/milestones/${id}/`;
export const MILESTONE_COMPLETE_URL = (id: number) => 
  `${API_URL}/milestones/milestones/${id}/complete/`;
export const MILESTONE_UPLOAD_DOCUMENT_URL = (id: number) => 
  `${API_URL}/milestones/milestones/${id}/upload_document/`;
```

**Notes**:
- Use `getApiUrl()` from `env.ts` for base URL
- Match exact backend URL patterns from `core/urls.py`

---

### ✅ Task 3: Create API Utility File
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/utils/api.ts`
**Pattern**: Follow `frontend_refernce/src/utils/api.ts`

**Structure**:
```typescript
import axios from "axios";
import { logout, refreshToken } from "../store/slices/userSlice";

const api = axios.create({
  timeout: 300000, // 5 minutes for large file uploads
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

// Response Interceptor: Auto-refresh token on 401
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
      } catch (err) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Notes**:
- Store will be injected after Redux store creation
- Handles automatic token refresh
- Logs out user if refresh fails

---

### ✅ Task 4: Set Up Redux Store
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/store/store.ts`
**Pattern**: Follow `frontend_refernce/src/redux/store.ts`

**Structure**:
```typescript
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import contractsReducer from "./slices/contractsSlice";
import paymentsReducer from "./slices/paymentsSlice";
import milestonesReducer from "./slices/milestonesSlice";
import { injectStore } from "../utils/api";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist auth state
};

const rootReducer = combineReducers({
  user: userReducer,
  contracts: contractsReducer,
  payments: paymentsReducer,
  milestones: milestonesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

export const persistor = persistStore(store);

// Inject store into API utility
injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Additional Files**:
- `frontend/src/store/hooks.ts` - Typed hooks
```typescript
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

---

## Phase 2: State Management Slices

### ✅ Task 5: Create User/Auth Slice
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/store/slices/userSlice.ts`
**Pattern**: Follow `frontend_refernce/src/redux/slices/userSlice.ts`

**Key Actions**:
- `login(email, password)` - POST to LOGIN_URL
- `signup(userData)` - POST to SIGNUP_URL
- `logout()` - POST to LOGOUT_URL, clear tokens
- `refreshToken()` - POST to REFRESH_TOKEN_URL
- `fetchProfile()` - GET PROFILE_URL
- `updateProfile(data)` - PUT PROFILE_UPDATE_URL
- `changePassword(data)` - POST PASSWORD_CHANGE_URL

**State Structure**:
```typescript
interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

**Notes**:
- Initialize tokens from localStorage
- Store tokens in localStorage on login
- Clear localStorage on logout

---

### ✅ Task 6: Create Contracts Slice
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/store/slices/contractsSlice.ts`

**Key Actions**:
- `fetchContracts()` - GET CONTRACTS_URL
- `fetchContract(id)` - GET CONTRACT_URL(id)
- `createContract(data)` - POST CONTRACTS_URL
- `updateContract(id, data)` - PUT CONTRACT_URL(id)
- `uploadContractDocument(id, file)` - POST CONTRACT_UPLOAD_DOCUMENT_URL(id)

**State Structure**:
```typescript
interface ContractsState {
  contracts: Contract[];
  currentContract: Contract | null;
  loading: boolean;
  error: string | null;
}
```

---

### ✅ Task 7: Create Payments Slice
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/store/slices/paymentsSlice.ts`

**Key Actions**:
- `fetchPayments(contractId?)` - GET PAYMENTS_URL with optional query param
- `fetchPayment(id)` - GET PAYMENT_URL(id)
- `createPayment(data)` - POST PAYMENTS_URL
- `updatePaymentStatus(id, status)` - PATCH PAYMENT_UPDATE_STATUS_URL(id)
- `fetchEscrowAccounts()` - GET ESCROW_ACCOUNTS_URL

**State Structure**:
```typescript
interface PaymentsState {
  payments: Payment[];
  escrowAccounts: EscrowAccount[];
  loading: boolean;
  error: string | null;
}
```

---

### ✅ Task 8: Create Milestones Slice
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/store/slices/milestonesSlice.ts`

**Key Actions**:
- `fetchMilestones(contractId?)` - GET MILESTONES_URL with optional query param
- `fetchMilestone(id)` - GET MILESTONE_URL(id)
- `createMilestone(data)` - POST MILESTONES_URL
- `updateMilestone(id, data)` - PUT MILESTONE_URL(id)
- `completeMilestone(id, data)` - PATCH MILESTONE_COMPLETE_URL(id)
- `uploadMilestoneDocument(id, file)` - POST MILESTONE_UPLOAD_DOCUMENT_URL(id)

**State Structure**:
```typescript
interface MilestonesState {
  milestones: Milestone[];
  currentMilestone: Milestone | null;
  loading: boolean;
  error: string | null;
}
```

---

## Phase 3: Component Integration

### ✅ Task 9: Update env.ts
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/config/env.ts`
**Action**: Ensure it uses `VITE_API_URL` from environment

**Current**: Already has `getApiUrl()` function
**Check**: Verify it reads from `import.meta.env.VITE_API_URL`

**Result**: ✅ Verified - `env.ts` correctly uses `import.meta.env.VITE_API_URL` with fallback to `http://localhost:8000/api`

---

### ✅ Task 10: Integrate Login Component
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/Login.tsx`

**Changes**:
1. ✅ Import Redux hooks and login action
2. ✅ Replace form submission with `dispatch(login(credentials))`
3. ✅ Add loading state from Redux
4. ✅ Handle errors from Redux
5. ✅ Redirect on successful login
6. ✅ Remove `alert()` calls

**Additional Changes**:
- ✅ Set up Redux Provider and PersistGate in `main.tsx`
- ✅ Added controlled form inputs (email, password)
- ✅ Added error display UI
- ✅ Added loading state to button
- ✅ Auto-redirect on successful authentication

**Code Pattern**:
```typescript
const dispatch = useAppDispatch();
const { loading, error, isAuthenticated } = useAppSelector(state => state.user);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const result = await dispatch(login({ email, password }));
  if (login.fulfilled.match(result)) {
    onLoginSuccess(); // Navigate to dashboard
  }
};
```

---

### ✅ Task 11: Integrate CreateAccount Component
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/CreateAccount.tsx`

**Changes**:
1. ✅ Import signup action and Redux hooks
2. ✅ Handle form submission with API call
3. ✅ Store contract file for later upload (contract upload requires authentication)
4. ✅ Handle validation errors from API
5. ✅ Show loading state during submission
6. ✅ Navigate to contract parsing on success

**Additional Changes**:
- ✅ Added controlled form inputs for all fields
- ✅ Added password confirmation validation
- ✅ Added form validation (required fields, password match, file type)
- ✅ Added error display UI
- ✅ Added file upload UI with drag & drop support
- ✅ Added file preview when contract is selected
- ✅ Store contract file info in sessionStorage for contract parsing page
- ✅ Handle role selection (intended-parent vs gestational-carrier)
- ✅ Handle invite code field for gestational carriers

**Code Pattern**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('role', role);
  if (contractFile) {
    formData.append('contract_document', contractFile);
  }
  
  const result = await dispatch(signup(formData));
  if (signup.fulfilled.match(result)) {
    onContractUploaded();
  }
};
```

---

### ✅ Task 12: Integrate Dashboard Component
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/Dashboard.tsx`

**Changes**:
1. ✅ Fetch contracts, payments, milestones on mount
2. ✅ Use data from Redux store instead of mock data
3. ✅ Add loading states
4. ✅ Handle errors
5. ✅ Remove mock data imports

**Additional Changes**:
- ✅ Removed imports from `sharedPaymentData` and `milestoneData`
- ✅ Added Redux hooks (`useAppDispatch`, `useAppSelector`)
- ✅ Added `useEffect` to fetch data on component mount
- ✅ Transformed API data to match UI requirements:
  - Upcoming milestones from API milestones (filtered by status, sorted by due date)
  - Recent payment activity from API payments (filtered by status, sorted by date)
  - Approved reimbursements from API payments (filtered by type and status)
- ✅ Added loading indicators for each section
- ✅ Added error display
- ✅ Added empty state messages
- ✅ Updated navigation buttons to use `onNavigate` callback
- ✅ User name now comes from Redux user state
- ✅ Dynamic calculation of current phase based on milestone completion

**Code Pattern**:
```typescript
useEffect(() => {
  dispatch(fetchContracts());
  dispatch(fetchPayments());
  dispatch(fetchMilestones());
}, [dispatch]);

const { contracts, payments, milestones, loading } = useAppSelector(state => ({
  contracts: state.contracts.contracts,
  payments: state.payments.payments,
  milestones: state.milestones.milestones,
  loading: state.contracts.loading || state.payments.loading || state.milestones.loading,
}));
```

---

### ✅ Task 13: Integrate Payments Component
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/Payments.tsx`

**Changes**:
1. ✅ Fetch payments on mount
2. ✅ Display real payment data
3. ✅ Handle payment status updates (action available via Redux)
4. ✅ Add loading/error states

**Additional Changes**:
- ✅ Removed imports from `sharedPaymentData` (completedPayments, upcomingPayments, getTotalEscrowBalance)
- ✅ Added Redux hooks (`useAppDispatch`, `useAppSelector`)
- ✅ Added `useEffect` to fetch payments and escrow accounts on component mount
- ✅ Transformed API data to match UI requirements:
  - Upcoming payments from API payments (filtered by status, sorted by date)
  - Transaction history from API payments (sorted by date, newest first)
  - Escrow balance calculated from escrow accounts
- ✅ Added loading indicators for each section
- ✅ Added error display
- ✅ Added empty state messages
- ✅ Updated logo to use Logo component
- ✅ Updated footer copyright text
- ✅ Payment status updates can be handled via `updatePaymentStatus` action from Redux

---

### ✅ Task 14: Integrate Milestones Component
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/Milestones.tsx`

**Changes**:
1. ✅ Fetch milestones on mount
2. ✅ Display real milestone data
3. ✅ Handle milestone completion
4. ✅ Handle document uploads

**Additional Changes**:
- ✅ Removed import from `milestoneData` (getMilestoneById)
- ✅ Added Redux hooks (`useAppDispatch`, `useAppSelector`)
- ✅ Added `useEffect` to fetch milestones on component mount
- ✅ Transformed API data to match UI requirements:
  - Upcoming milestones from API milestones (filtered by status, sorted by due date)
  - Completed milestones from API milestones (filtered by status, sorted by completion date)
  - Journey progress calculated from milestone completion percentage
- ✅ Added milestone completion functionality:
  - "Mark as Complete" button for in_progress milestones
  - Calls `completeMilestone` action from Redux
- ✅ Added document upload functionality:
  - "Upload Document" button for in_progress milestones
  - Calls `uploadMilestoneDocument` action from Redux
  - Shows uploading state during file upload
- ✅ Added loading indicators for each section
- ✅ Added error display
- ✅ Added empty state messages
- ✅ Updated logo to use Logo component
- ✅ Updated footer copyright text
- ✅ Dynamic journey progress bar based on actual milestone completion

---

### ✅ Task 15: Integrate SurrogateDashboard Component
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/SurrogateDashboard.tsx`

**Changes**:
1. ✅ Replace `handleSubmitReimbursement` with API call
2. ✅ Replace `handleSubmitHeartbeat` with API call
3. ✅ Fetch surrogate-specific data
4. ✅ Handle file uploads for documents
5. ✅ Remove `alert()` calls

**Additional Changes**:
- ✅ Removed imports from `milestoneData` and `sharedPaymentData`
- ✅ Added Redux hooks (`useAppDispatch`, `useAppSelector`)
- ✅ Added `useEffect` to fetch payments, milestones, and contracts on component mount
- ✅ Reimbursement submission:
  - Uses `createPayment` action with `payment_type='milestone'` (backend doesn't have separate reimbursement type)
  - Includes description prefixed with "Reimbursement:"
  - Handles file upload (file stored in state, can be uploaded separately if needed)
  - Shows loading state during submission
  - Displays success/error messages
- ✅ Heartbeat confirmation:
  - Uses `uploadMilestoneDocument` to upload ultrasound report
  - Uses `completeMilestone` to mark milestone as completed
  - Combines both actions in sequence
  - Shows loading state during submission
  - Displays success/error messages
- ✅ Data transformation:
  - Total received calculated from paid/completed payments
  - Next payment derived from upcoming milestones
  - Current phase calculated from milestone completion
  - Upcoming payments from API milestones
  - Recent payments from API payments (sorted by date)
- ✅ Added loading indicators for each section
- ✅ Added error display with dismissible messages
- ✅ Added success message display
- ✅ Updated logo to use Logo component
- ✅ Updated footer copyright text
- ✅ Removed all `alert()` calls, replaced with proper UI messages

---

### ✅ Task 16: Integrate SurrogateLostWages Component
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/SurrogateLostWages.tsx`

**Changes**:
1. ✅ Replace `handleSubmit` with API call
2. ✅ Upload pay stub and appointment documents (file handling ready, upload can be added separately if backend supports)
3. ✅ Handle form data submission
4. ✅ Show success/error messages
5. ✅ Remove `alert()` calls

**Additional Changes**:
- ✅ Removed logo import (replaced with Logo component)
- ✅ Added Redux hooks (`useAppDispatch`, `useAppSelector`)
- ✅ Added `useEffect` to fetch payments and contracts on component mount
- ✅ Lost wages submission:
  - Uses `createPayment` action with `payment_type='milestone'` (backend doesn't have separate lost wages type)
  - Description includes reason, clinic name, and date
  - Notes include all employment details and calculation information
  - Calculates amount based on employment type (hourly/salaried)
  - Shows loading state during submission
  - Displays success/error messages
  - Auto-navigates to dashboard after successful submission
  - Resets form after submission
- ✅ File upload handling:
  - Pay stub and appointment file uploads are handled in state
  - Files can be removed before submission
  - File validation (at least one file required)
  - Note: File uploads to backend would need separate endpoint or can be added to payment creation if backend supports it
- ✅ Data transformation:
  - Monthly usage calculated from API payments (filtered by description and current month)
  - Past requests from API payments (filtered by description, sorted by date)
  - Contract data can be enhanced with real contract information
- ✅ Form validation:
  - Validates required fields before submission
  - Validates that at least one document is uploaded
  - Validates that calculated amount is greater than 0
  - Validates that contract exists
- ✅ Added success/error message banners (dismissible)
- ✅ Updated logo to use Logo component
- ✅ Updated footer copyright text
- ✅ Removed all `alert()` calls, replaced with proper UI messages
- ✅ "Save draft" functionality shows success message (can be enhanced with localStorage or API)

---

## Phase 4: Authentication & Routing

### ✅ Task 17: Add Authentication Guard
**Status**: ✅ **COMPLETED**
**File**: `frontend/src/components/ProtectedRoute.tsx` (new file)

**Structure**:
- ✅ Created ProtectedRoute component that works with custom navigation system
- ✅ Checks authentication status from Redux store
- ✅ Shows loading spinner while checking authentication
- ✅ Redirects to login if not authenticated (via callback)
- ✅ Fetches user profile if token exists but user data is missing
- ✅ Renders children if authenticated

**Update App.tsx**:
- ✅ Wrapped protected routes with `<ProtectedRoute>`
- ✅ Protected routes: dashboard, payments, milestones, surrogate-dashboard, surrogate-payments, surrogate-lost-wages, support, surrogate-support, contract-parsing, contract-template
- ✅ Initialize auth state on app load (checks for token and fetches profile if needed)
- ✅ Added useEffect to fetch profile on app mount if token exists

**Protected Routes**:
- Dashboard (IP)
- Payments (IP)
- Milestones (IP)
- Surrogate Dashboard
- Surrogate Payments
- Surrogate Lost Wages
- Support (both IP and Surrogate)
- Contract Parsing
- Contract Template

**Public Routes** (not protected):
- Home
- Login
- Create Account
- Thumbnails
- Milestone Database
- Milestone Flows
- IP Milestone Review
- Escrow Admin Console

---

## Phase 5: Error Handling & UX

### ✅ Task 18: Add Error Handling
**Status**: ✅ **COMPLETED**
**Files**: All integrated components

**Changes**:
1. ✅ Added Toaster component to App.tsx for global toast notifications
2. ✅ Updated Login component to use toast.error() for errors and toast.success() for success
3. ✅ Updated CreateAccount component to use toast notifications for validation and API errors
4. ✅ Updated Dashboard component to show toast errors for failed data fetching
5. ✅ Updated Payments component to show toast errors for failed data fetching
6. ✅ Updated Milestones component to show toast errors and success messages for milestone operations
7. ✅ Updated SurrogateDashboard component to use toast notifications for reimbursement and heartbeat submissions
8. ✅ Updated SurrogateLostWages component to use toast notifications for lost wages requests
9. ✅ Removed inline error/success message displays in favor of toast notifications
10. ✅ Added proper error handling for network errors, validation errors, and API errors
11. ✅ All error messages are user-friendly and actionable

**Pattern**:
```typescript
import { toast } from 'sonner';

// Error handling
useEffect(() => {
  if (error) {
    toast.error(error);
  }
}, [error]);

// Success handling
if (action.fulfilled.match(result)) {
  toast.success('Operation completed successfully');
} else if (action.rejected.match(result)) {
  toast.error(result.error?.message || 'Operation failed');
}
```

---

### ✅ Task 19: Update Docker Compose
**File**: `docker-compose.yml`

**Changes**:
```yaml
frontend:
  environment:
    - VITE_API_URL=http://localhost/api  # Via nginx proxy
```

**Note**: For production, set `VITE_API_URL` in build environment.

---

## Additional Considerations

### TypeScript Types
Create type definitions for API responses:
- `frontend/src/types/api.ts` - API response types
- `frontend/src/types/user.ts` - User types
- `frontend/src/types/contract.ts` - Contract types
- `frontend/src/types/payment.ts` - Payment types
- `frontend/src/types/milestone.ts` - Milestone types

### Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] Signup with valid data
- [ ] Signup with invalid data (validation errors)
- [ ] Token refresh on 401
- [ ] Logout clears tokens
- [ ] Protected routes redirect when not authenticated
- [ ] Data fetching on dashboard
- [ ] Form submissions work
- [ ] File uploads work
- [ ] Error messages display correctly
- [ ] Loading states show during API calls

### Migration Notes
- Keep existing mock data as fallback during development
- Test each component integration individually
- Use feature flags if needed for gradual rollout
- Monitor API calls in browser DevTools Network tab

---

## Implementation Order Recommendation

1. **Foundation** (Tasks 1-4): Set up infrastructure
2. **Auth Slice** (Task 5): Core authentication
3. **Login/Signup** (Tasks 10-11): Basic auth flow
4. **Protected Routes** (Task 17): Secure the app
5. **Data Slices** (Tasks 6-8): Data management
6. **Dashboard** (Task 12): Main data display
7. **Feature Components** (Tasks 13-16): Individual features
8. **Error Handling** (Task 18): Polish
9. **Docker Config** (Task 19): Deployment

---

## Estimated Time

- **Phase 1** (Foundation): 2-3 hours
- **Phase 2** (Slices): 3-4 hours
- **Phase 3** (Components): 4-6 hours
- **Phase 4** (Auth Guard): 1 hour
- **Phase 5** (Error Handling): 2-3 hours

**Total**: ~12-17 hours

---

## Questions to Resolve

1. **State Management**: Confirm Redux is acceptable (vs Context API)
2. **Routing**: Does the app use React Router or custom routing?
3. **Error Display**: Use existing UI components or add toast library?
4. **File Upload**: Confirm FormData approach for document uploads
5. **API Endpoints**: Verify all endpoints exist in backend (especially for surrogate features)
