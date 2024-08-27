import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    cloud: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const cloudSlice = createSlice({
    name: 'cloud',
    initialState,
    reducers: {
        getCloud(state, action) {
            state.status = 'success';
            state.cloud = action.payload.results;
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
    getCloud,
    updateStatus,
    setError,
    editStatus,
} = cloudSlice.actions;

export default cloudSlice.reducer;
