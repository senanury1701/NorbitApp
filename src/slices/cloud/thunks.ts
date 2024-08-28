import axiosInstance from '../../config/axiosConfig'
import {getCloud, updateStatus , setError,} from './reducers'



export const fetchCloud = (page:any = 1, ) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`cloud/?page=${page}`);
      dispatch(getCloud(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addCloud = (cloud: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post('cloud/', cloud,);
    console.log('istek atildi');

    dispatch(updateStatus());
    dispatch(fetchCloud());
    return response.data;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  }
};


  export const deleteCloud = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`cloud/${id}/`);
    dispatch(fetchCloud()); 
    return id;
  };
  
  export const editCloud = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...cloud } = values; 
  
  
    try {
      const response = await axiosInstance.put(`/cloud/${id}/`, cloud, );
      
      dispatch(fetchCloud()); 
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.message)); 
      throw error;
    }
  };
  
  
  

