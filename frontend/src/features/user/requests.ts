import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    requests: [],
};

const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        setAllRequests: (state, action) => {
            state.requests = action.payload;
        },
        updateRequests: (state, action) => {
            const newRequests = state.requests.filter((obj: any) => obj._id !== action.payload);
        },
    },
});


export const {setAllRequests,updateRequests} = requestSlice.actions;
export default requestSlice.reducer