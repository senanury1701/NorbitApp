import axiosInstance from '../../config/axiosConfig'
import {getDrive, updateStatus , setError,} from './reducers'



export const fetchDrive = (page:any = 1, ) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`drive/?page=${page}`);
    
      dispatch(getDrive(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addDrive = (drive: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post('drive/', drive, );
    dispatch(updateStatus());
    dispatch(fetchDrive());
    return response.data;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  }
};


  export const deleteDrive = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`drive/${id}`);
    dispatch(fetchDrive()); 
    return id;
  };
  
  export const editDrive = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...drive } = values; 
  
    try {
      const response = await axiosInstance.put(`/drive/${id}/`, drive,);
  
      dispatch(fetchDrive()); 
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.message)); 
      throw error;
    }
  };
  
  
  

