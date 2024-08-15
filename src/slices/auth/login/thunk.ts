
import axiosInstance from '../../../config/axiosConfig'

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

export const loginUser = (user : any, history : any) => async (dispatch : any) => {
  try {

    const response = await axiosInstance.post('accounts/login/', {
      username: user.username,
      password: user.password,
    });
    if (response.status === 200) {
      sessionStorage.setItem('accessToken', response.data.key);
      
      if (!response.data.key) {
        throw new Error('Access token not found in sessionStorage');
      }

      const userDataResponse = await axiosInstance.get('accounts/user/');

      const authUser = JSON.stringify(userDataResponse.data);
      
      dispatch(loginSuccess(authUser));
      sessionStorage.setItem('authUser', authUser);
      history('/dashboard')
    } else {
      throw new Error('Login request failed');
    }
  } catch (error:any) {
    dispatch(apiError(error.message));
  }
};


export const logoutUser = () => async (dispatch : any) => {
  try {

    const logoutResponse = await axiosInstance.post('accounts/logout/');
    
    if (logoutResponse.status === 200) {
      sessionStorage.removeItem("authUser");
      sessionStorage.removeItem("accessToken");
      dispatch(logoutUserSuccess(logoutResponse.status));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};


export const resetLoginFlag = () => async (dispatch : any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};