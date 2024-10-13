
import {createSlice } from '@reduxjs/toolkit'
const initialState = {
  notificationCount:0
}

export const notificationSlice = createSlice({
    name:'notification',
    initialState,
    reducers:{
        addNotificationCount:(state,action)=>{
              state.notificationCount = action.payload

        },
        
        
    }
})

export const{addNotificationCount} = notificationSlice.actions;
export default notificationSlice.reducer