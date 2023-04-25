import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { Game, initialGame } from "../games/games.type";

export const gameSlice = createSlice({
  name: "game",
  initialState: initialGame,
  reducers: {
    initGame: (state, action: PayloadAction<Game>) => {
      state = { ...action.payload };
      return state;
    },
  },
});

export const { initGame } = gameSlice.actions;
export const getMemoizedGame = createSelector(
  (state: RootState) => state.game,
  (game) => game
);

export default gameSlice.reducer;
