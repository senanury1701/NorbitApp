import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    purchase: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const purchaselice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        getPurchase(state, action) {
            state.status = 'success';
            state.purchase = action.payload.results;
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
    getPurchase,
    updateStatus,
    setError,
    editStatus,
} = purchaselice.actions;

export default purchaselice.reducer;
