import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { Game, initialGame, UserInGame } from "../games/games.type";
import { User } from "../users/users.type";

export const gameSlice = createSlice({
  name: "games",
  initialState: {},
  reducers: {
    setGame: (state, action: PayloadAction<Game>) => {
      state[action.payload.id] = { ...action.payload };
    },
    upsertUser: (state, action: PayloadAction<[string, UserInGame]>) => {
      const [idGame, user] = action.payload;
      const game = state[idGame];
      if (!game) return state;
      const users = game.users;
      const userIndex = users.findIndex((u) => u.idUser === user.idUser);
      if (userIndex === -1) {
        game.users = [...game.users, user];
      } else {
        users[userIndex].ready = true;
        game.users = users;
      }
    },
  },
});

export const { setGame, upsertUser } = gameSlice.actions;
export const getMemoizedGame = createSelector(
  (state: RootState) => state.game,
  (game) => game
);

export default gameSlice.reducer;
