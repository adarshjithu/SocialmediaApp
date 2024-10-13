import { createSlice } from "@reduxjs/toolkit";
const initialState = {
   allPost: [],
   profileData:{},
   isCurrentUser:localStorage.getItem('isCurrentUser')?JSON.parse(localStorage.getItem('isCurrentUser')||''):{status:true,userId:null}
};

export const profileSlice = createSlice({
   name: "comment",
   initialState,
   reducers: {
      addAllPostForProfile: (state, action) => {
         state.allPost = action.payload;
      },
      setCurrentUser:(state,actions)=>{

         localStorage.setItem("isCurrentUser",JSON.stringify(actions.payload))
         state.isCurrentUser = actions.payload
      },
      setProfileData:(state,actions)=>{
         state.profileData = actions.payload
      }
   },
});

export const { addAllPostForProfile,setCurrentUser,setProfileData } = profileSlice.actions;
export default profileSlice.reducer;
