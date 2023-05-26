import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { Game, UserInGame } from "../games/games.type";

export const gameSlice = createSlice({
  name: "game",
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
    startGame: (state, action: PayloadAction<[string, number, number]>) => {
      const [idGame, startedAt, endedAt] = action.payload;
      state[idGame].startedAt = startedAt;
      state[idGame].endedAt = endedAt;

      return state;
    },
    lastChanged: (state, action: PayloadAction<any>) => {
      const { idUser, date, idGame, users } = action.payload;
      state[idGame].last = { idUser, date };
      state[idGame].users = users;
    },
    addScoreToLast: (state, action: PayloadAction<[string, number]>) => {
      const [idGame, points] = action.payload;
      const indexLast = state[idGame].users?.findIndex((u) => u.idUser === state[idGame].last.idUser);
      if (indexLast === -1) return state;
      state[idGame].users[indexLast].score += points;
      return state;
    },
  },
});

export const { setGame, upsertUser, lastChanged, addScoreToLast, startGame } = gameSlice.actions;
export const getMemoizedGame = createSelector(
  (state: RootState) => state.game,
  (game) => game
);

export default gameSlice.reducer;
