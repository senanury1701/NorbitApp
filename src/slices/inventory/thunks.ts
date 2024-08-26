import axiosInstance from '../../config/axiosConfig'
import {getInventories, updateStatus , setError,} from './reducers'



export const fetchInventories = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`inventory/list/?page=${page}&search=${search}`);
      dispatch(getInventories(response.data));
      
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  
export const addInventories = (values:any) => async (dispatch: any)  => {
  try {
      console.log(values);
    
      const response = await axiosInstance.post('/inventory/create/', values);
      dispatch(updateStatus());      
      dispatch(fetchInventories()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteInventories = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`inventory/${id}/`);
    dispatch(fetchInventories()); 
    return id;
  };
  
  export const editInventories = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedInventories } = values; 
    try {
      console.log(updatedInventories);
      console.log(id);
      
      const response = await axiosInstance.put(`/inventory/${id}/`, updatedInventories);
      
      dispatch(fetchInventories());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

