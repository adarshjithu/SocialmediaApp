import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData:localStorage.getItem("userData")?JSON.parse(localStorage.getItem('userData')||''):null,
    adminData:localStorage.getItem("adminData")?JSON.parse(localStorage.getItem('adminData')||''):null,
  

}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUserCreadential:(state,action)=>{
                state.userData = action.payload;
                
                localStorage.setItem('userData',JSON.stringify(action.payload));
        },
        setAdminCredential:(state,action)=>{
                 state.adminData = action.payload;
                 localStorage.setItem('adminData',JSON.stringify(action.payload))
        },
        userLogout:(state)=>{
               state.userData = null;
               localStorage.removeItem('userData')
        },
        adminLogout:(state)=>{
               state.adminData = null;
               localStorage.removeItem("adminData")
        }
    }
})

export const{setUserCreadential,setAdminCredential,userLogout,adminLogout} = authSlice.actions;
export default authSlice.reducer