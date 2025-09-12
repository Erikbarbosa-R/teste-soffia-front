import { configureStore } from '@reduxjs/toolkit';
import { authSlice, postsSlice } from './slices';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    posts: postsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk = typeof store.dispatch;

// Tipos para useSelector
export type { RootState };
