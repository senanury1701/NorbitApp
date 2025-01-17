import axiosInstance from '../../config/axiosConfig'
import {getEmployeeManangement, updateStatus , setError,} from './reducers'



export const fetchEmployeeManangement = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`ems/list?page=${page}&search=${search}`);
    
      dispatch(getEmployeeManangement(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addEmployeeManangement = (EmployeeManangement_name:any) => async (dispatch: any)  => {
  try {
      const response = await axiosInstance.post('ems/create/', EmployeeManangement_name);
      dispatch(updateStatus());      
      dispatch(fetchEmployeeManangement()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteEmployeeManangement = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`ems/employee/${id}/`);
    dispatch(fetchEmployeeManangement()); 
    return id;
  };
  
  export const editEmployeeManangement  = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedEmployeeManangement  } = values; 
    try {
      
      const response = await axiosInstance.put(`/ems/employee/${id}/`, updatedEmployeeManangement );
      
      dispatch(fetchEmployeeManangement());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

