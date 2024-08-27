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

  
export const addKnowhow = (knowhow: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post('knowhow/create/', knowhow, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    dispatch(updateStatus());
    dispatch(fetchKnowhow());
    return response.data;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  }
};


  export const deleteKnowhow = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`knowhow/detail/${id}/`);
    dispatch(fetchKnowhow()); 
    return id;
  };
  
  export const editKnowhow = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...knowhow } = values; 
    const formData = new FormData();
  
    formData.append('problem', knowhow.problem);
    formData.append('solve_text', knowhow.solve_text);
  
    if (knowhow.file_1 instanceof File) formData.append('file_1', knowhow.file_1);
    if (knowhow.file_2 instanceof File) formData.append('file_2', knowhow.file_2);
    if (knowhow.file_3 instanceof File) formData.append('file_3', knowhow.file_3);
  
    try {
      const response = await axiosInstance.put(`/knowhow/detail/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      dispatch(fetchKnowhow()); 
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.message)); // Hata mesajını dispatch et
      throw error;
    }
  };
  
  
  

