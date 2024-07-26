import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    employeeManangement: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const employeeManangementSlice = createSlice({
    name: 'employeeManangement',
    initialState,
    reducers: {
        getEmployeeManangement(state, action) {
            state.status = 'success';
            state.employeeManangement = action.payload.results;
            state.count = action.payload.count;
            state.previous = action.payload.previous;
            state.next = action.payload.next;                
            
            
        },
        updateStatus(state) {
            state.updateStatus = 'success';
        },
        setError(state, action) {
            state.error = action.payload;
            console.log(state.error);
            
        },
        editStatus(state) {
            state.editStatus = 'success';
        }
    },
});

export const {
    getEmployeeManangement,
    updateStatus,
    setError,
    editStatus,
} = employeeManangementSlice.actions;

export default employeeManangementSlice.reducer;
