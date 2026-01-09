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

// Inject store into API utility after store is fully configured
injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
