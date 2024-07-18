import axiosInstance from '../../config/axiosConfig'
import {getDatasheet, updateStatus , setError,} from './reducers'



export const fetchDatasheet = (page = 1) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`datasheet/list?page=${page}`);
      
      dispatch(getDatasheet(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

export const fetchAllDatasheet = (count:any) => async (dispatch: any) => {
  const limit = 5;
  const totalPages = Math.ceil(count / limit);
  let allData:any = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const data = await fetchDatasheet(page)(dispatch);
      allData = [...allData, ...data];
      
    } catch (error: any) {

      break;
    }
  }
  
  dispatch(getDatasheet(allData));
};
  
export const addDatasheet = (Datasheet_name:any) => async (dispatch: any)  => {
  try {
      const response = await axiosInstance.post('Datasheet/create/', Datasheet_name);
      dispatch(updateStatus());      
      dispatch(fetchDatasheet()); 
      return response.data;
  } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
  }
};


  export const deleteDatasheet = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`datasheet/${id}/`);
    dispatch(fetchDatasheet()); 
    return id;
  };
  
  export const editDatasheet = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...updatedDatasheet } = values; 
    try {
      console.log(updatedDatasheet);
      
      const response = await axiosInstance.put(`/datasheet/${id}/`, updatedDatasheet);
      console.log(response);
      
      dispatch(fetchDatasheet());
      return response.data;
    } catch (error:any) {
      dispatch(setError(error.message));
      throw error;
    }
  };
  
  

