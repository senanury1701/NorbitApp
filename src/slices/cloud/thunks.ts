import axiosInstance from '../../config/axiosConfig'
import {getCloud, updateStatus , setError,} from './reducers'



export const fetchCloud = (page:any = 1, ) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`cloud/?page=${page}`);
      dispatch(getCloud(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addCloud = (cloud: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post('cloud/', cloud, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    dispatch(updateStatus());
    dispatch(fetchCloud());
    return response.data;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  }
};


  export const deleteCloud = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`cloud/detail/${id}/`);
    dispatch(fetchCloud()); 
    return id;
  };
  
  export const editCloud = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...cloud } = values; 
    const formData = new FormData();
  
    formData.append('problem', cloud.problem);
    formData.append('solve_text', cloud.solve_text);
  
    if (cloud.file_1 instanceof File) formData.append('file_1', cloud.file_1);
    if (cloud.file_2 instanceof File) formData.append('file_2', cloud.file_2);
    if (cloud.file_3 instanceof File) formData.append('file_3', cloud.file_3);
  
    try {
      const response = await axiosInstance.put(`/cloud/detail/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      dispatch(fetchCloud()); 
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.message)); // Hata mesajını dispatch et
      throw error;
    }
  };
  
  
  

