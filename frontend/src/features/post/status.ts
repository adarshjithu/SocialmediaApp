
import {createSlice } from '@reduxjs/toolkit'
const initialState = {
    allStory:[],
    isUploadStatus:false,
    isUploadFeedback:false,
    storyBar:{view:false,stories:{}}
    
}

export const statusSlice = createSlice({
    name:'status',
    initialState,
    reducers:{
        getAllStatusData:(state,action)=>{
            state.allStory = action.payload

        },
        isStatusUpload:(state,action)=>{
       
             state.isUploadStatus = action.payload
        },
        viewStoryBar:(state,action)=>{
            state.storyBar = action.payload
        }
        ,isUploadFeedback:(state,action)=>{
            state.isUploadFeedback = action.payload;
        }
        
    }
})

export const{getAllStatusData,isStatusUpload,viewStoryBar,isUploadFeedback} = statusSlice.actions;
export default statusSlice.reducer