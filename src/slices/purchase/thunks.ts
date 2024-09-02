import axiosInstance from '../../config/axiosConfig'
import {getPurchase,  setError,} from './reducers'



export const fetchPurchase = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`purchase/list?page=${page}&search=${search}`);
    
      dispatch(getPurchase(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  export const deletePurchase = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`purchase/${id}/`);
    dispatch(fetchPurchase()); 
    return id;
  };
  
  export const editPurchase = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedPurchase } = values; 

    try {
      console.log(values);
      
      const response = await axiosInstance.put(`/purchase/${id}/`, updatedPurchase);
      
      dispatch(fetchPurchase());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

