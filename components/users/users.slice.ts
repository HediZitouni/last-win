import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { initialUser, User } from "./users.type";
import { Game } from "../games/games.type";

export const usersSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    initUser: (state, action: PayloadAction<User>) => {
      state = { ...action.payload }; //Object.assign(state, action.payload);
      return state;
    },
    addGame: (state, action: PayloadAction<Game>) => {
      state.games.push(action.payload);
      return state;
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      return state;
    },
  },
});

export const { initUser, addGame, updateName } = usersSlice.actions;
export const getMemoizedUser = createSelector(
  (state: RootState) => state.user,
  (user) => user
);

export default usersSlice.reducer;
