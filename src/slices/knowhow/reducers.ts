import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    knowhow: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const knowhowSlice = createSlice({
    name: 'knowhow',
    initialState,
    reducers: {
        getKnowhow(state, action) {
            state.status = 'success';
            state.knowhow = action.payload.results;
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
    getKnowhow,
    updateStatus,
    setError,
    editStatus,
} = knowhowSlice.actions;

export default knowhowSlice.reducer;
