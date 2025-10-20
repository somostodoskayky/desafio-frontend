import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './slices/videoSlice';
import searchReducer from './slices/searchSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    video: videoReducer,
    search: searchReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
