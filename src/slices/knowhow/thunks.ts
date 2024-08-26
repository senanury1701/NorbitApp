import axiosInstance from '../../config/axiosConfig'
import {getKnowhow, updateStatus , setError,} from './reducers'



export const fetchKnowhow = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`knowhow/list?page=${page}&search=${search}`);
    
      dispatch(getKnowhow(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addKnowhow = (project:any) => async (dispatch: any)  => {
  console.log(project);
  try {
    
    
      const response = await axiosInstance.post('knowhow/create/', project);
      dispatch(updateStatus());      
      dispatch(fetchKnowhow()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteKnowhow = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`knowhow/${id}/`);
    dispatch(fetchKnowhow()); 
    return id;
  };
  
  export const editKnowhow = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedproject } = values; 

    try {
      console.log(values);
      
      const response = await axiosInstance.put(`/Knowhow/${id}/`, updatedproject);
      
      dispatch(fetchKnowhow());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

