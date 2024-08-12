import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    permissions: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        getPermission(state, action) {
            state.status = 'success';
            state.permissions = action.payload.results;
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
    getPermission,
    updateStatus,
    setError,
    editStatus,
} = permissionSlice.actions;

export default permissionSlice.reducer;
