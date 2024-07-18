import axiosInstance from '../../config/axiosConfig'
import {getCategories, updateStatus , setError,} from './reducers'



export const fetchCategory = (page = 1) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`category/?page=${page}`);
      
      dispatch(getCategories(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

export const fetchAllCategory = (count:any) => async (dispatch: any) => {
  const limit = 5;
  const totalPages = Math.ceil(count / limit);
  let allData:any = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const data = await fetchCategory(page)(dispatch);
      allData = [...allData, ...data];
      
    } catch (error: any) {

      break;
    }
  }
  
  dispatch(getCategories(allData));
};
  
export const addCategory = (Category_name:any) => async (dispatch: any)  => {
  try {
      const response = await axiosInstance.post('/category/', Category_name);
      dispatch(updateStatus());      
      dispatch(fetchCategory()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteCategory = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`category/${id}/`);
    dispatch(fetchCategory()); 
    return id;
  };
  
  export const editCategory = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedCategory } = values; 
    try {
      console.log(updatedCategory);
      
      const response = await axiosInstance.put(`/category/${id}/`, updatedCategory);
      console.log(response);
      
      dispatch(fetchCategory());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

