import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    datasheet: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const datasheetSlice = createSlice({
    name: 'datasheet',
    initialState,
    reducers: {
        getDataSheet(state, action) {
            state.status = 'success';
            state.datasheet = action.payload.results;
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
    getDataSheet,
    updateStatus,
    setError,
    editStatus,
} = datasheetSlice.actions;

export default datasheetSlice.reducer;
