import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    projects: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        getProject(state, action) {
            state.status = 'success';
            state.projects = action.payload.results;
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
    getProject,
    updateStatus,
    setError,
    editStatus,
} = projectSlice.actions;

export default projectSlice.reducer;
