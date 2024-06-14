import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";


export interface UserSchema{
  token : string, username: string, firstName: string, lastName: string, mobileNumber: string 
  ,_id:string
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
    _id:""
  }
}

export const userSliece = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserSchema>) => {
      const newObj = action.payload;
      state.user = { ...state.user , ...newObj};
    },
    removeUser: (state) => {
      state.user = { ...initialState.user };
    },
  }
});

export const { addUser, removeUser } = userSliece.actions;

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