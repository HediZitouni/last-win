import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { initialUser, User } from "./users.type";

export const usersSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    initUser: (state, action: PayloadAction<User>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { initUser } = usersSlice.actions;
export const getMemoizedUser = createSelector(
  (state: RootState) => state.user,
  (user) => user
);

export default usersSlice.reducer;
