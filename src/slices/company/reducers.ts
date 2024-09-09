import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    companies: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        getCompanies(state, action) {
            state.status = 'success';
            state.companies = action.payload.results;
            state.count = action.payload.count;
            state.previous = action.payload.previous;
            state.next = action.payload.next;                
            
            
        },
        updateStatus(state) {
            state.updateStatus = 'success';
        },
        setError(state, action) {
            state.error = action.payload;
           
        },
        editStatus(state) {
            state.editStatus = 'success';
        }
    },
});

export const {
    getCompanies,
    updateStatus,
    setError,
    editStatus,
} = companySlice.actions;

export default companySlice.reducer;
