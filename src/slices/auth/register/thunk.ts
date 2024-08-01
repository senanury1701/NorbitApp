import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
} from "./reducer";
import axiosInstance from '../../../config/axiosConfig'


export const registerUser = (user : any) => async (dispatch : any) => {
  try {
    console.log(user);

    const response = await axiosInstance.post('accounts/registration/', {
      username: user.username,
      email: user.email,
      password1: user.password1,
      password2: user.password2,
      user_type: user.user_type,
      first_name: user.first_name,
      last_name: user.last_name,
      company_name: user.company_name,
      job_title: user.job_title,
      job_start_date: user.job_start_date
    });
    
    if (response.status === 200) {
      
      dispatch(registerUserSuccessful(response.data));
    } else {
      dispatch(registerUserFailed(response.data));
    }
  } catch (error:any) {
    dispatch(registerUserFailed(error));
  }
};
export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

// export const apiError = () => async (dispatch : any) => {
//   try {
//     const response = dispatch(apiErrorChange(false));
//     return response;
//   } catch (error) {
//     return error;
//   }
// };