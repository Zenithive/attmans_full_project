import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { userType } from "../services/user.access.service";


export interface UserSchema {
  token: string,
  username: string,
  firstName: string,
  lastName: string,
  mobileNumber: string,
  _id: string, 
  userType:
  userType,
  profilePhoto?: string;
  sessionId?: string;
}
export interface UserState {
  user: UserSchema;
}

const initialState: UserState = {
  user: {
    token: "",
    username: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    _id: "",
    userType: "",
    sessionId: "",

  }
}

export const userSliece = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserSchema>) => {
      const newObj = action.payload;
      state.user = { ...state.user, ...newObj };
    },
    removeUser: (state) => {
      state.user = { ...initialState.user };
    },
    updateProfilePhoto: (state, action: PayloadAction<string>) => {
      state.user.profilePhoto = action.payload;
    },
  }
});

export const { addUser, removeUser, updateProfilePhoto } = userSliece.actions;

export const selectUserSession = (state: RootState) => state.user.user;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const userReducer = (state = initial_state, action: { type: any; payload: any; } ) => {
//   switch (action.type) {
//       case USER_ACTIONS.SET_USER:
//           return { ...action.payload };
//       default:
//           return state;
//   }
// }

export default userSliece.reducer;