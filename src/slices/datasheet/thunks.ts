import axiosInstance from '../../config/axiosConfig'
import {getDataSheet, updateStatus , setError,} from './reducers'



export const fetchDataSheet = (page:any = 1,) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`datasheet/list?page=${page}`);
    
      dispatch(getDataSheet(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  
export const addDataSheet = (dataSheet:any) => async (dispatch: any)  => {
  try {
      const response = await axiosInstance.post('datasheet/list/', dataSheet);
      dispatch(updateStatus());      
      dispatch(fetchDataSheet()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteDataSheet = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`datasheet/${id}/`);
    dispatch(fetchDataSheet()); 
    return id;
  };
  
  export const editDataSheet = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedDataSheet } = values; 
    try {
      console.log(updatedDataSheet);
      
      const response = await axiosInstance.put(`/datasheet/${id}/`, updatedDataSheet);
      console.log(response);
      
      dispatch(fetchDataSheet());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

