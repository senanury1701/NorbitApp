import axiosInstance from '../../config/axiosConfig'
import {getProject, updateStatus , setError,} from './reducers'



export const fetchProjects = (page:any = 1, search = '') => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`projects/list?page=${page}&search=${search}`);
    
      dispatch(getProject(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addProjects = (project:any) => async (dispatch: any)  => {
  console.log(project);
  try {
    
    
      const response = await axiosInstance.post('projects/create/', project);
      dispatch(updateStatus());      
      dispatch(fetchProjects()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteProjects = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`projects/${id}/`);
    dispatch(fetchProjects()); 
    return id;
  };
  
  export const editProjects = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedproject } = values; 

    try {
      console.log(values);
      
      const response = await axiosInstance.put(`/projects/${id}/`, updatedproject);
      
      dispatch(fetchProjects());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

