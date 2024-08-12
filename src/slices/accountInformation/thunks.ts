import axiosInstance from '../../config/axiosConfig'
import {getAccountInformation, updateStatus , setError,} from './reducers'



export const fetchAccountInformation = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`/accountinfo/list?page=${page}&search=${search}`);
    
      dispatch(getAccountInformation(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addAccountInformation = (accountinfo:any) => async (dispatch: any)  => {
  try {
      const response = await axiosInstance.post('accountinfo/create/', accountinfo);
      dispatch(updateStatus());      
      dispatch(fetchAccountInformation()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteAccountInformation = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`accountinfo/${id}/`);
    dispatch(fetchAccountInformation()); 
    return id;
  };
  
  export const editAccountInformation = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedAccountInformation } = values; 
    try {
      
      const response = await axiosInstance.put(`/accountinfo/${id}/`, updatedAccountInformation);
      
      dispatch(fetchAccountInformation());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

