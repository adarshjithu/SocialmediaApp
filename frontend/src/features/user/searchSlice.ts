
import {createSlice } from '@reduxjs/toolkit'
const initialState = {
  recent:localStorage.getItem("recent")?JSON.parse(localStorage.getItem('recent')||'[]'):[],
  
}

export const searchSlice = createSlice({
    name:'search',
    initialState,
    reducers:{
        setRecentSearch:(state,action)=>{
              state.recent = action.payload;
              localStorage.setItem('recent',JSON.stringify(action.payload));

        },
        deleteSearch:(state,action)=>{
          const newSearch = state.recent.filter((obj:any)=> obj._id!==action.payload);
          state.recent= newSearch;
          localStorage.setItem('recent',JSON.stringify(newSearch))
        },
        clearAllRecentSearch:(state)=>{
          state.recent = []
          localStorage.setItem('recent',JSON.stringify('[]'))
        }
  
        
    }
})

export const{setRecentSearch,deleteSearch,clearAllRecentSearch} = searchSlice.actions;
export default searchSlice.reducer