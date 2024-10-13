
import {createSlice } from '@reduxjs/toolkit'
const initialState = {
    isComment:false,
    postId:null
}

export const commentSlice = createSlice({
    name:'comment',
    initialState,
    reducers:{
        isComment:(state,action)=>{
              state.postId=action.payload
              state.isComment = true

        },
        isUnComment:(state)=>{
            state.postId=null,
            state.isComment = false
        }
        
    }
})

export const{isComment,isUnComment} = commentSlice.actions;
export default commentSlice.reducer