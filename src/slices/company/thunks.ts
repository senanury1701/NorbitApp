import axiosInstance from '../../config/axiosConfig'
import {getCompanies, updateStatus , setError,} from './reducers'



export const fetchCompanies = () => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get('company/list');
      dispatch(getCompanies(response.data.results));
      
      return response.data;
  } catch (error:any) {
      dispatch(getCompanies(error.message));
      throw error;
  }
};
  
export const addCompany = (company_name:any) => async (dispatch: any)  => {
  try {
      const response = await axiosInstance.post('company/create/', company_name);
      dispatch(updateStatus());      
      dispatch(fetchCompanies()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteCompany = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`company/${id}/`);
    dispatch(fetchCompanies()); 
    return id;
  };
  
  export const editCompany = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedCompany } = values; 
    try {
      const response = await axiosInstance.put(`compony/${id}`, updatedCompany);
      dispatch(fetchCompanies());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

