import { createSlice  } from '@reduxjs/toolkit';

export const initialState = {
    companies: [],
    status: 'idle',
    error: null, 
    updateStatus: '', 
    editStatus: ''
  };



const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        getCompanies(state,action){
            state.status = 'success'
            state.companies = action.payload
        },
        updateStatus(state ) {            
            state.updateStatus = 'success';
        },
        setError(state, action) {
            state.error = action.payload;
        },
        editStatus(state,actions){
            state.editStatus = 'success';
        }
    },
   
});
export const {
    getCompanies,
    updateStatus,
    setError,
    editStatus,
  } = companySlice.actions
  
export default companySlice.reducer;

