import axiosInstance from '../../config/axiosConfig'
import {getInventories, updateStatus , setError,} from './reducers'



export const fetchInventories = (page = 1) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`inventory/list/?page=${page}`);
      dispatch(getInventories(response.data));
      
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

export const fetchAllInventories = (count:any) => async (dispatch: any) => {
  const limit = 5;
  const totalPages = Math.ceil(count / limit);
  let allData:any = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const data = await fetchInventories(page)(dispatch);
      allData = [...allData, ...data];
      
    } catch (error: any) {

      break;
    }
  }
  
  dispatch(getInventories(allData));
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
  
  

