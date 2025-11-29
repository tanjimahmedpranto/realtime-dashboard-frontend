import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string | null;
}

const initialState: AuthState = {
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ email: string } | null>) {
      state.email = action.payload?.email ?? null;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
