import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    drive: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const driveSlice = createSlice({
    name: 'drive',
    initialState,
    reducers: {
        getDrive(state, action) {
            state.status = 'success';
            state.drive = action.payload.results;
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
    getDrive,
    updateStatus,
    setError,
    editStatus,
} = driveSlice.actions;

export default driveSlice.reducer;
