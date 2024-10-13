
import {createSlice } from '@reduxjs/toolkit'

interface IInitialState{
    usersOnline:string[]
}

const initialState = {
    usersOnline:[],
    socket:null
    
}

export const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setUsersOnline:(state,action)=>{
           

        }
        ,setSocket:(state,action)=>{
            state.socket = action.payload
        }
      
        
    }
})

export const{setUsersOnline,setSocket} = chatSlice.actions;
export default chatSlice.reducer