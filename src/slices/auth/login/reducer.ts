import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  userType: '', 
  error: "", 
  loading: false,
  isUserLogout: false,
  errorMsg: false, 
};

const loginSlice  = createSlice({
  name: "login",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.data;
      state.loading = true;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload.user; 
      state.userType = action.payload.userType; 
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true
    },
    reset_login_flag(state) {
      state.error = "";
      state.loading = false;
      state.errorMsg = false;
    }
  },
});

export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag
} = loginSlice.actions

export default loginSlice.reducer;