import axiosInstance from '../../config/axiosConfig'
import {getDrive, updateStatus , setError,} from './reducers'



export const fetchDrive = (page:any = 1, ) => async (dispatch: any) => {
  try {
      const response = await axiosInstance.get(`drive/?page=${page}`);
    
      dispatch(getDrive(response.data));
      return response.data.results;
  } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
  }
};

  
export const addDrive = (drive: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post('drive/create/', drive, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    dispatch(updateStatus());
    dispatch(fetchDrive());
    return response.data;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  }
};


  export const deleteDrive = (id: number) => async (dispatch: any) => {
    await axiosInstance.delete(`drive/detail/${id}/`);
    dispatch(fetchDrive()); 
    return id;
  };
  
  export const editDrive = (values: any) => async (dispatch: any, getState: any) => {
    const { id, ...drive } = values; 
    const formData = new FormData();
  
    formData.append('problem', drive.problem);
    formData.append('solve_text', drive.solve_text);
  
    if (drive.file_1 instanceof File) formData.append('file_1', drive.file_1);
    if (drive.file_2 instanceof File) formData.append('file_2', drive.file_2);
    if (drive.file_3 instanceof File) formData.append('file_3', drive.file_3);
  
    try {
      const response = await axiosInstance.put(`/drive/detail/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      dispatch(fetchDrive()); 
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.message)); 
      throw error;
    }
  };
  
  
  

