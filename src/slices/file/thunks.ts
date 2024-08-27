import axiosInstance from '../../config/axiosConfig'
import {getFile, updateStatus , setError,} from './reducers'



export const fetchFile = (page:any = 1, ) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`file/?page=${page}`);
    
      dispatch(getFile(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addFile = (file: FormData) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post('file/', file, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    dispatch(updateStatus());
    dispatch(fetchFile());
    return response.data;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  }
};


  export const deleteFile = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`file/detail/${id}/`);
    dispatch(fetchFile()); 
    return id;
  };
  
  export const editFile = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...file } = values; 
    const formData = new FormData();
  
    formData.append('problem', file.problem);
    formData.append('solve_text', file.solve_text);
  
    if (file.file_1 instanceof File) formData.append('file_1', file.file_1);
    if (file.file_2 instanceof File) formData.append('file_2', file.file_2);
    if (file.file_3 instanceof File) formData.append('file_3', file.file_3);
  
    try {
      const response = await axiosInstance.put(`/file/detail/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      dispatch(fetchFile()); 
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.message)); 
      throw error;
    }
  };
  
  
  

