import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    accountInformation: [],
    count: 0,
    previous: null,
    next: null,
    status: 'idle',
    error: null,
    updateStatus: '',
    editStatus: ''
};

const accountInformationSlice = createSlice({
    name: 'accountInformation',
    initialState,
    reducers: {
        getAccountInformation(state, action) {
            state.status = 'success';
            state.accountInformation = action.payload.results;
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
    getAccountInformation,
    updateStatus,
    setError,
    editStatus,
} = accountInformationSlice.actions;

export default accountInformationSlice.reducer;
