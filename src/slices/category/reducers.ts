import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    categories: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        getCategories(state, action) {
            state.status = 'success';
            state.categories = action.payload;
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
    getCategories,
    updateStatus,
    setError,
    editStatus,
} = categorySlice.actions;

export default categorySlice.reducer;
