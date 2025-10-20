import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../types/youtube";

const loadPersistedAuthState = (): AuthState => {
  try {
    const persistedUser = localStorage.getItem("auth_user");
    const persistedToken = localStorage.getItem("google_access_token");

    if (persistedUser && persistedToken) {
      return {
        isAuthenticated: true,
        user: JSON.parse(persistedUser),
        accessToken: persistedToken,
      };
    }
  } catch (error) {
    console.error("Error loading persisted auth state:", error);
  }

  return {
    isAuthenticated: false,
    user: null,
    accessToken: null,
  };
};

const initialState: AuthState = loadPersistedAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: AuthState["user"];
        accessToken: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      if (action.payload.user) {
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
      }
      localStorage.setItem("google_access_token", action.payload.accessToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("google_access_token");
      localStorage.removeItem("google_refresh_token");
    },
    updateUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("auth_user", JSON.stringify(action.payload));
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
