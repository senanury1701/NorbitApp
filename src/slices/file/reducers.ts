import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    file: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        getFile(state, action) {
            state.status = 'success';
            state.file = action.payload.results;
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
    getFile,
    updateStatus,
    setError,
    editStatus,
} = fileSlice.actions;

export default fileSlice.reducer;
