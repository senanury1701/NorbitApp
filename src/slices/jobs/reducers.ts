import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    jobs: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        getJobs(state, action) {
            state.status = 'success';
            if (state.count > 5) {
                state.jobs = action.payload;
            }else{
                state.jobs = action.payload.results;
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
    getJobs,
    updateStatus,
    setError,
    editStatus,
} = jobsSlice.actions;

export default jobsSlice.reducer;
