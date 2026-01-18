import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  admin: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userProfile: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAuthState: (
      state,
      action: PayloadAction<{
        user: User | null;
        userProfile: UserProfile | null;
      }>,
    ) => {
      state.user = action.payload.user;
      state.userProfile = action.payload.userProfile;
      state.loading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.userProfile = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setUser,
  setUserProfile,
  setLoading,
  setError,
  setAuthState,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
