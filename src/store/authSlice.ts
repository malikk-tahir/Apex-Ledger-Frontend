import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  [key: string]: any; 
}

interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userData: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.userData = action.payload.userData || action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.loading = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;