// utils/axiosInstance.ts
import axios from 'axios';
import { SERVER_URL } from '../constants/api.constant';
import { selectUserSession, UserSchema } from '../reducers/userReducer';
import { useAppSelector } from '../reducers/hooks.redux';
import { store } from '../reducers/store'; // Import the Redux store


const axiosInstance = axios.create({
  baseURL: SERVER_URL, // Set your API base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization header or modify config
    const state = store.getState();
    const userDetails: UserSchema = (state?.user?.user || {}) as UserSchema;
    console.log(userDetails, "state/", state )

    if (userDetails.token) {
      config.headers['Authorization'] = `Bearer ${userDetails.token}`;
      config.headers['ctxId'] = `${userDetails._id}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);


export default axiosInstance;
