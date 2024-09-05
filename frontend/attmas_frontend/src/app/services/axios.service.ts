// utils/axiosInstance.ts
import axios from "axios";
import { SERVER_URL } from "../constants/api.constant";
import { selectUserSession, UserSchema } from "../reducers/userReducer";
import { useAppSelector } from "../reducers/hooks.redux";
import { store } from "../reducers/store"; // Import the Redux store
import { pubsub } from "./pubsub.service";
import { PUB_SUB_ACTIONS } from "../constants/pubsub.constant";

const axiosInstance = axios.create({
  baseURL: SERVER_URL, // Set your API base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization header or modify config
    const state = store.getState();
    const userDetails: UserSchema = (state?.user?.user || {}) as UserSchema;
    pubsub.publish(PUB_SUB_ACTIONS.backDropOpen, {
      message: "Backdrop modal open",
    });

    if (userDetails.token) {
      config.headers["Authorization"] = `Bearer ${userDetails.token}`;
      config.headers["ctxId"] = `${userDetails._id}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    pubsub.publish(PUB_SUB_ACTIONS.backDropClose, {
      message: "Backdrop modal Close",
    });
    return response;
  },
  (error) => {
    pubsub.publish(PUB_SUB_ACTIONS.backDropClose, {
      message: "Backdrop modal Close",
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
