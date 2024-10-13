import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { adminLogout, setUserCreadential, userLogout } from "../features/user/authSlice";
import { store } from "../app/store";

const axiosInstance = axios.create({
     baseURL: "http://localhost:3000",
     headers: {
          "Content-Type": "application/json",
     },
     withCredentials: true,
});

// Function to refresh access token
const refreshAccessToken = async () => {
     
    try {
      const response = await axiosInstance.post('/refresh-token', {}, {
        withCredentials: true
      });

      console.log(response.data,'refreshed')    
      const { access_token } = response.data;
      Cookies.set('access_token', access_token); 
      return access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  };
  axiosInstance.interceptors.request.use(
    config => {
      const accessToken = Cookies.get('access_token');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if(response.data.message){
        toast.success( response.data.message)
       
      }
      return response},
      
    async error => {
      const originalRequest = error.config;
      //checking token for admin
      if(error?.response?.status===401&&error.response.data.message=='Admin Credentials Invalid please SignIn'){
        store.dispatch(adminLogout())
      }
      //checking refresh token for user
      if(error.response?.status===401&&error.response.data?.message =='Refresh Token Expired'){
        store.dispatch(userLogout())
      }

      if(error.response?.status==404){
        window.location.href='/error/404'
      }

      if(error?.response?.data?.message=='Internal Server Error'){
        window.location.href='/error/internal'
      }
      //checking error for refreshtoken
      if (error.response?.status === 401&&error.response.data.message=='Access Token Expired' && !originalRequest._retry) {
          
        originalRequest._retry = true;
        try {
           await refreshAccessToken();
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          store.dispatch(userLogout());
          
          window.location.href = '/login'; // Redirect to login
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );



export default axiosInstance;



//athepole accesstoken expired or not found anel nwe accesstoken issue cheyyan oru route call cheyyunnuhnd backendil