import axiosInstance from '../../config/axiosConfig'
import {getPermission, updateStatus , setError,} from './reducers'



export const fetchPermission = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`permission/list?page=${page}&search=${search}`);
    
      dispatch(getPermission(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addPermission = (project:any) => async (dispatch: any)  => {
  try {
    
    
      const response = await axiosInstance.post('permission/', project);
      dispatch(updateStatus());      
      dispatch(fetchPermission()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deletePermission = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`permission/${id}/`);
    dispatch(fetchPermission()); 
    return id;
  };
  
  export const editPermission = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedPermission } = values; 

    try {
      console.log(values);
      
      const response = await axiosInstance.put(`/permission/${id}/`, updatedPermission);
      
      dispatch(fetchPermission());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

