import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tempUserData: localStorage.getItem("tempUserData") ? JSON.parse(localStorage.getItem("tempUserData") || "") : null,
    tempForgetUserData:localStorage.getItem("tempForgetUserData") ? JSON.parse(localStorage.getItem("tempForgetUserData") || "") : null,
};

export const otpSlice = createSlice({
    name: "otp",
    initialState,
    reducers: {
        setTempUserData: (state, action) => {
            state.tempUserData = action.payload;

            localStorage.setItem("tempUserData", JSON.stringify(action.payload));
        },

        clearTempUserData: (state) => {
            state.tempUserData = null;
            localStorage.removeItem("tempUserData");
        },
        setTempForgetUserData:(state,action)=>{
            state.tempForgetUserData = action.payload;
            localStorage.setItem("tempForgetUserData", JSON.stringify(action.payload));
        },
        clearTempForgetUserData:(state)=>{
              state.tempForgetUserData=null;
              localStorage.removeItem("tempForgetUserData")
        }
    },
});

export const {setTempUserData,clearTempUserData,setTempForgetUserData,clearTempForgetUserData  } = otpSlice.actions;
export default otpSlice.reducer;
