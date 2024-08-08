import axiosInstance from '../../config/axiosConfig'
import {getJobs, updateStatus , setError,} from './reducers'



export const fetchJobs = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`jobs/list/?search=${search}&page=${page}`);
      dispatch(getJobs(response.data));
      
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

export const fetchAllJobs = (count:any) => async (dispatch: any) => {
  const limit = 5;
  const totalPages = Math.ceil(count / limit);
  let allData:any = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const data = await fetchJobs(page)(dispatch);
      allData = [...allData, ...data];
      
    } catch (error: any) {

      break;
    }
  }
  
  dispatch(getJobs(allData));
};
  
export const addJobs = (jobs_name:any) => async (dispatch: any)  => {
  try {
      const response = await axiosInstance.post('/jobs/create/', jobs_name);
      dispatch(updateStatus());      
      dispatch(fetchJobs()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteJobs = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`jobs/${id}/`);
    dispatch(fetchJobs()); 
    return id;
  };
  
  export const editJobs = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedJobs } = values; 
    try {
      console.log(updatedJobs);
      console.log(id);
      
      const response = await axiosInstance.put(`/jobs/${id}/`, updatedJobs);
      
      dispatch(fetchJobs());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

