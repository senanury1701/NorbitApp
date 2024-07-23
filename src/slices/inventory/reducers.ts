import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    inventories: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const inventoriesSlice = createSlice({
    name: 'inventories',
    initialState,
    reducers: {
        getInventories(state, action) {
            state.status = 'success';
            if (state.count > 5) {
                state.inventories = action.payload;
            }else{
                state.inventories = action.payload.results;
                state.count = action.payload.count;
                state.previous = action.payload.previous;
                state.next = action.payload.next;                
            }

            
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
    getInventories,
    updateStatus,
    setError,
    editStatus,
} = inventoriesSlice.actions;

export default inventoriesSlice.reducer;
