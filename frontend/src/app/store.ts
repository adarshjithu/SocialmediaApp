import {configureStore} from '@reduxjs/toolkit';
import authSlice from '../features/user/authSlice';
import commentSlice from '../features/user/commentSlice'
import postSlice from '../features/post/postSlice';
import statusSlice  from '../features/post/status';
import profileSlice from '../features/user/profileSlice'
import searchSlice from '../features/user/searchSlice';
import requestSlice from '../features/user/requests'
import chatSlice  from '../features/chat/chat';
import  notificationSlice  from '../features/user/notification';

export interface RootState {
    auth:{[key:string]:any},
    comment:{[key:string]:any},
    post:{[key:string]:any},
    status:{[key:string]:any},
    profile:{[key:string]:any},
    search:{[key:string]:any},
    requests:{[key:string]:any},
    chat:{[key:string]:any},
    notification:{[key:string]:any},
    
    
}

export const store =  configureStore({
    reducer:{
        auth:authSlice,
        comment:commentSlice,
        post:postSlice,
        status:statusSlice,
        profile:profileSlice,
        search:searchSlice,
        requests:requestSlice,
        chat:chatSlice,
        notification:notificationSlice
    }
})