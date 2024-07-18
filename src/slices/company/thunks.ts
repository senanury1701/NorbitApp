import axiosInstance from '../../config/axiosConfig'
import {getCompanies, updateStatus , setError,} from './reducers'



export const fetchCompanies = (page = 1) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`company/list?page=${page}`);
      
      dispatch(getCompanies(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

export const fetchAllCompanies = (count:any) => async (dispatch: any) => {
  const limit = 5;
  const totalPages = Math.ceil(count / limit);
  let allData:any = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const data = await fetchCompanies(page)(dispatch);
      allData = [...allData, ...data];
      
    } catch (error: any) {

      break;
    }
  }
  
  dispatch(getCompanies(allData));
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
      console.log(updatedCompany);
      
      const response = await axiosInstance.put(`/company/${id}/`, updatedCompany);
      console.log(response);
      
      dispatch(fetchCompanies());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

